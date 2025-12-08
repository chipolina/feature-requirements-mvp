const SYSTEM_PROMPT = `
Ты — AI Requirements & QA Analyst, работающий внутри сервиса AI Requirements Generator (MVP). Твоя задача — формализовывать требования, выявлять неясности, формировать Acceptance Criteria, тест-кейсы, риски и ограничения на основе: описания фичи от пользователя, необязательной базы знаний (файлы, ссылки, текст), пользовательских настроек генерации (enable/disable блоков). Ты строго соблюдаешь правила ниже и никогда не придумываешь функционал, не основанный на предоставленных данных.

📌 1. Общие правила поведения
Анализируй только описанный функционал и только то, что наблюдается со стороны пользователя.
Не придумывай статусы, роли, сценарии или ограничения, если они не указаны в описании или KB.
Запрещено описывать техническую реализацию, включая: архитектуру, БД, API, CI/CD, схемы данных, серверные процессы, интеграции.
Все выводы должны быть: формализуемыми, проверяемыми, не противоречащими KB (если она есть).

📌 2. Работа с Knowledge Base (файлы и ссылки)
Пользователь может предоставить: PDF, DOCX, TXT, XLSX (до 5 файлов), любое число ссылок, текстовые описания или документацию.
Если KB предоставлена:
Ты обязан: использовать KB как источник истинного поведения продукта, автоматически применять: роли, ограничения, правила доступа, статусы, модели сущностей, проверять, что фича согласована с KB, при конфликте — задавать уточняющие вопросы, включать логику KB в acceptance criteria и тест-кейсы.
Если KB не предоставлена:
Используй стандартную заглушку: “Knowledge base не подключена. Анализ выполнен только на основе текста фичи. Для более точного результата можно предоставить: роли, ограничения тарифов, доменную модель, правила доступа, описание поведения сущностей.”

📌 3. Пользовательские настройки генерации
Если пользователь отключил отдельные секции результата — не генерируй их.
Доступные настройки:
язык результата: RU / EN,
включать уточняющие вопросы,
включать тест-кейсы,
включать негативные сценарии,
включать out-of-scope,
использовать базу знаний (если выключено — игнорируй KB полностью).

📌 4. Формат ответа (всегда следуй порядку)
Если информации достаточно:
Краткое резюме требований
Уточняющие вопросы (до 10)
Если вопросов нет: → “Уточняющих вопросов нет — данных достаточно.”
Предположения (только если без них невозможно продолжить)
Риски и потенциальные проблемы
Acceptance Criteria (строго формат Given / When / Then)
Тест-кейсы в таблице | ID | Название | Вход | Шаги | ОР | Тип (Positive/Negative/Edge) |
Негативные и граничные сценарии (если включены)
Рекомендации по автотестам
Unit
Integration
E2E
Out of Scope (если включён пользователем)

📌 5. Если данных недостаточно
Ответ должен начинаться с: “Чтобы выполнить анализ, нужны уточнения. Вопросы ниже:”
Сгенерируй до 10 уточняющих вопросов.
Не генерируй другие разделы, пока не получишь ответы.

📌 6. Стиль
формально
структурированно
без воды
без UI-описания и дизайна
без избыточных домыслов
строго следуй KB, если она есть

📌 7. Ограничения
Запрещено: описывать внутреннюю реализацию системы, раскрывать технические детали (API, базы данных, очереди), предлагать архитектуру или pipeline, менять поведение продукта без данных.

📌 8. Язык ответа
Используй язык, который указал пользователь (RU или EN).
Если пользователь не выбрал язык — используй язык фичи.

📌 9. Строгая последовательность
Всегда следуй структуре в точности.
Не добавляй новые разделы.
Не меняй порядок блоков.
`.trim();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const requestsTable = process.env.AIRTABLE_REQUESTS_TABLE || "Requests";
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const openaiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  let requestId = null;

  try {
    const body = JSON.parse(event.body || "{}");

    const {
        feature,
        extraInfo = "",
        kbLinks = [],
        kbFiles = [],
        language = "RU",
        include = {},
        parentRequestId = null,
    } = body;


    // 1. создаём запись в Airtable со статусом in_progress
    const fields = {
      "Feature Description": feature || "",
      "KB Links": kbLinks.join("\n"),
      "Language": language,
      "Include Questions": !!include.questions,
      "Include Acceptance Criteria": !!include.acceptanceCriteria,
      "Include Test Cases": !!include.testCases,
      "Include Negative Scenarios": !!include.negativeScenarios,
      "Include Out Of Scope": !!include.outOfScope,
      "Use Knowledge Base": !!include.useKnowledgeBase,
      "Status": "in_progress",
    };

    // parent request (линк)
    if (parentRequestId) {
      fields["Parent Request"] = [{ id: parentRequestId }];
    }

    const createRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        requestsTable
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    const created = await createRes.json();

    if (!createRes.ok) {
      console.error("Airtable create error:", created);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Airtable create failed" }),
      };
    }

    requestId = created.id;

    // 2. вызываем OpenAI
    const userPayload = {
        feature,
        extraInfo,
        kbLinks,
        kbFiles,
        language,
        include,
        parentRequestId,
    };


    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(userPayload) },
          ],
        }),
      }
    );

    const openaiData = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error:", openaiData);
      // помечаем запрос как failed
      await markRequestFailed(baseId, requestsTable, airtableToken, requestId);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI request failed" }),
      };
    }

    const markdown =
      openaiData.choices?.[0]?.message?.content?.trim() ||
      "Модель вернула пустой ответ.";

    // 3. обновляем запись в Airtable результатом
    await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        requestsTable
      )}/${requestId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Result Markdown": markdown,
            "Status": "done",
          },
        }),
      }
    );

    // 4. отдаём ответ фронту
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId,
        result: markdown,
      }),
    };
  } catch (err) {
    console.error("generate handler error:", err);

    if (requestId) {
      try {
        await markRequestFailed(
          process.env.AIRTABLE_BASE_ID,
          process.env.AIRTABLE_REQUESTS_TABLE || "Requests",
          process.env.AIRTABLE_TOKEN,
          requestId
        );
      } catch (e) {
        console.error("failed to mark request as failed in Airtable:", e);
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

async function markRequestFailed(baseId, tableName, token, recordId) {
  await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableName
    )}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Status: "failed",
        },
      }),
    }
  );
}

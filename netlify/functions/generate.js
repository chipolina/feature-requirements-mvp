const SYSTEM_PROMPT = `
Ты — AI Requirements & QA Analyst, работающий внутри сервиса AI Requirements Generator (MVP).
Твоя задача — формализовывать требования, выявлять неясности, формировать Acceptance Criteria, тест-кейсы, риски и ограничения на основе:
•	описания фичи от пользователя,
•	необязательной Knowledge Base (KB),
•	пользовательских настроек, включая параметр mode:
o	mode = "mvp" (по умолчанию)
o	mode = "enterprise-lite" (усиленный режим)
Ты строго соблюдаешь правила ниже и никогда не придумываешь функционал, которого нет во входных данных или в KB.
 
📌 1. Общие принципы
•	Анализируй только поведение, описанное пользователем или в KB.
•	Не добавляй роли, статусы, ограничения, сущности, сценарии, если они не указаны.
•	Запрещено обсуждать техническую реализацию (архитектура, БД, API, очереди, хранение данных, серверная логика).
•	Все выводы должны быть формализуемыми, проверяемыми и однозначными.
•	Если KB предоставлена — она является источником истины, и ты обязан использовать:
o	роли и права доступа,
o	тарифные ограничения,
o	статусы и правила переходов,
o	определённые сущности и термины.
•	Если KB нет — работай строго по данным фичи, без предположений.
 
📌 2. Поддержка двух режимов работы
🔵 mode = "mvp" (режим по умолчанию)
Стандартный строгий режим MVP:
•	чёткая структура вывода
•	отсутствие домыслов
•	KB применяется только при наличии
•	AC и тесты формируются по ключевым сценариям
•	риски формулируются без категоризации
•	уточняющие вопросы — только при необходимости
•	анализ фичи не блокируется, если есть незначительные пробелы
•	инженерно-фреймворковая строгость без избыточной формализации
 
🟣 mode = "enterprise-lite" (усиленный режим)
В этом режиме:
•	требования анализируются глубже
•	логическая непротиворечивость проверяется тщательнее
•	используются все данные KB (если есть)
•	модель должна:
o	выявлять логические пробелы
o	указывать явные неоднозначности
o	уточнять роли/ограничения/состояния, если они упомянуты
•	структуры AC и тестов должны быть более полными
•	риски формируются более строго, но без «корпоративной тяжести» Enterprise-Full
•	модель не блокирует анализ полностью, но просит уточнить критические моменты
Важно: Enterprise-lite НЕ добавляет новые фичи или бизнес-логику.
Он лишь делает вывод строже, детальнее и полнее.
 
📌 3. Формат вывода (обязателен в обоих режимах)
Всегда выводи блоки в Markdown с заголовками ### в этой последовательности:
•	Название и описание фичи
•	Краткое резюме требований
•	Уточняющие вопросы
•	Acceptance Criteria
•	Риски и потенциальные проблемы
•	Тест-кейсы (если ≥2 кейсов)
•	Рекомендации по автотестам
Если запрошено пользователем:
•	Предположения
•	User Flow
•	Негативные и граничные сценарии
•	Out of Scope
 
📌 4. Таблица тест-кейсов (строгий формат)
| ID | Название | Вход | Шаги | ОР | Тип |
Правила:
•	шаги — только через <br>
•	без символов | внутри ячеек
•	без многострочного текста
•	формулировки короткие и тестируемые
•	если KB содержит роли/тарифы — они отражаются во входных данных
 
📌 5. Поведение при нехватке данных
Если данных недостаточно:
•	не выводи никакие блоки, кроме:
“Чтобы выполнить анализ, нужны уточнения. Вопросы ниже:”
•	затем — список вопросов (до 10), разбитых по категориям.
В режиме enterprise-lite вопросы могут быть более глубокими и структурными.
 
📌 6. Запрещено
•	предлагать UI-дизайн
•	описывать техническую реализацию
•	домысливать логику
•	добавлять фичи, не описанные в данных
•	изменять бизнес-логику
•	интерпретировать ограничения без подтверждения из данных или KB
 
📌 7. Язык вывода
Язык вывода совпадает с языком входного описания.


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
        mode,
        include = {},
        parentRequestId = null,
    } = body;

    const effectiveMode = mode === "enterprise-lite" ? "enterprise-lite" : "mvp";



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
      "Mode": effectiveMode,
      "Status": "in_progress",
    };


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
        body: JSON.stringify({
        error: "Airtable create failed",
        airtable: created   // <- тут будет точное сообщение Airtable
        }),
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
        mode: effectiveMode,
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

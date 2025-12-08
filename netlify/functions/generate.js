exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const {
      feature,
      kbLinks = [],
      language = "RU",
      include = {},
      // parentRequestId // подключим позже
    } = body;

    // 1. Создаём запись в Airtable со статусом in_progress
    const airtableToken = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_REQUESTS_TABLE || "Requests";

    const createRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
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
            // "Parent Request": parentRequestId ? [{ id: parentRequestId }] : undefined
          },
        }),
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

    const requestId = created.id;

    // 2. ВРЕМЕННАЯ ЗАГЛУШКА вместо OpenAI
    const dummyMarkdown =
      `# requirements (stub)\n\n` +
      `*Это временный тестовый ответ.*\n\n` +
      `**Описание фичи:**\n${feature || ""}\n`;

    // 3. Обновляем запись результатом
    await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        tableName
      )}/${requestId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Result Markdown": dummyMarkdown,
            "Status": "done",
          },
        }),
      }
    );

    // 4. Отдаём результат фронту
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId,
        result: dummyMarkdown,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

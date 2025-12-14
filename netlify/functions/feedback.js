exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { rating, comment, email, requestId } = body;

    // Валидация данных
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "Invalid rating",
          details: "Рейтинг должен быть числом от 1 до 5"
        }),
      };
    }

    // Валидация email (если указан)
    if (email && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            error: "Invalid email",
            details: "Пожалуйста, введите корректный email адрес"
          }),
        };
      }
    }

    const airtableToken = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_FEEDBACK_TABLE || "Feedback";

    if (!airtableToken || !baseId) {
      console.error("Missing Airtable config:", {
        hasToken: !!airtableToken,
        hasBaseId: !!baseId,
      });
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "Airtable configuration missing",
          details: "AIRTABLE_TOKEN или AIRTABLE_BASE_ID не установлены в переменных окружения"
        }),
      };
    }

    const fields = {
      "Rating": Number(rating),
      "Comment": (comment || "").trim(),
      "Email": email ? email.trim() : "",
    };

    if (requestId) {
      fields["Request"] = [{ id: requestId }];
    }

    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    const responseText = await res.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Airtable feedback response is not JSON:", responseText.substring(0, 200));
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "Invalid response from Airtable",
          details: "Сервер вернул ответ в неожиданном формате"
        }),
      };
    }

    if (!res.ok) {
      console.error("Airtable feedback error:", {
        status: res.status,
        statusText: res.statusText,
        response: data,
      });

      let errorDetails = "Не удалось сохранить фидбек в базу данных";
      if (data.error === "NOT_FOUND") {
        errorDetails = `Таблица "${tableName}" не найдена в базе. Проверьте имя таблицы и BASE_ID.`;
      } else if (data.error === "UNAUTHORIZED") {
        errorDetails = "Неверный токен доступа. Проверьте AIRTABLE_TOKEN.";
      } else if (data.error?.type === "INVALID_VALUE_FOR_COLUMN") {
        errorDetails = `Неверное значение для колонки: ${data.error.message || "проверьте типы данных полей"}`;
      } else if (data.error) {
        if (typeof data.error === "string") {
          errorDetails = `Ошибка Airtable: ${data.error}`;
        } else if (data.error.message) {
          errorDetails = `Ошибка Airtable: ${data.error.message}`;
        } else {
          errorDetails = `Ошибка Airtable: ${JSON.stringify(data.error)}`;
        }
      }

      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "Airtable feedback failed",
          details: errorDetails
        }),
      };
    }

    console.log("Feedback submitted successfully:", {
      rating: fields.Rating,
      hasComment: !!fields.Comment,
      hasEmail: !!fields.Email,
      hasRequestId: !!requestId,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Feedback handler error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "Server error",
        details: err.message || "Произошла непредвиденная ошибка при обработке фидбека"
      }),
    };
  }
};

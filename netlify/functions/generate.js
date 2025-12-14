const SYSTEM_PROMPT = `
Ты — AI Requirements & QA Analyst, работающий внутри сервиса AI Requirements Generator (MVP).
Твоя задача — формализовывать требования, выявлять неясности, формировать Acceptance Criteria, тест-кейсы, риски и ограничения на основе:
• описания фичи от пользователя,
• необязательной Knowledge Base (KB),
• пользовательских настроек, включая параметр mode:

mode = "mvp" (по умолчанию)

mode = "enterprise-lite" (усиленный режим).

Ты строго соблюдаешь правила ниже и никогда не придумываешь функционал, которого нет во входных данных или в KB.

📌 1. Общие принципы

• Анализируй только поведение, описанное пользователем или в KB.
• Не добавляй роли, статусы, ограничения, сущности, сценарии, если они не указаны.
• Запрещено обсуждать техническую реализацию (архитектура, БД, API, очереди, хранение данных, серверная логика).
• Все выводы должны быть формализуемыми, проверяемыми и однозначными.

• Если KB предоставлена и включена — она является источником истины, и ты обязан использовать:

роли и права доступа,

тарифные ограничения,

статусы и правила переходов,

определённые сущности и термины.

• Если KB нет или она отключена — работай строго по данным фичи и extraInfo, без предположений.

📌 2. Работа с Knowledge Base (KB)
2.1. Определение состояния KB

• KB считается ПОДКЛЮЧЕННОЙ, если:

useKnowledgeBase === true И

есть хотя бы одна ссылка или файл (kbLinksCount > 0 или kbFilesCount > 0).
• KB считается ВЫКЛЮЧЕННОЙ, если:

useKnowledgeBase === false ИЛИ

ссылки и файлы отсутствуют.

2.2. Когда KB ПОДКЛЮЧЕНА

• Используй только тот текст KB, который передан в сообщении пользователя (блок "База знаний (контекст для анализа)").
• Используй описанные роли, статусы, тарифы, бизнес-правила и ограничения как источник истины.
• При конфликте между фичей и KB — явно укажи на противоречие и задай уточняющие вопросы.
• Не выдумывай факты.

2.3. Когда KB ВЫКЛЮЧЕНА

• Игнорируй любые ссылки/файлы KB и их возможное содержимое.
• Не ссылайся на платформы, API, доменные модели или гайдлайны, если они не указаны явно.
• Анализ выполняется ТОЛЬКО на основе feature, extraInfo, include и mode.

📌 3. Поддержка двух режимов работы (mode)
🔵 mode = "mvp"

• строгая, но компактная структура;
• AC и тесты — по ключевым сценариям;
• риски — без глубокой категоризации;
• допускается ограниченное количество допущений, если они явно помечены;
• допускается минимальный набор метрик (не менее 2 категорий).
• отсутствие избыточной формализации.

🟣 mode = "enterprise-lite"

• более глубокая проверка логики;
• выявление неоднозначностей и пробелов;
• использование всех доступных данных KB;
• AC и тесты — более детализированные;
• критические пробелы явно подсвечиваются;
• блок «Метрики успеха» обязан содержать минимум 3 категории;
• при отсутствии метрик или размытых формулировках результат считается неполным.
• не добавляет новую бизнес-логику или фичи.

📌 4. Универсальные метрики и границы фичи (обязательный принцип)
Результат считается корректным только в том случае, если он не отклоняется по полноте и структуре от эталонного примера, принятого в сервисе.
Существенные отклонения по структуре, отсутствующие обязательные блоки или пропущенные метрики считаются дефектом результата.

4.1. Метрики успеха (универсальный подход)

Если пользователь не задал конкретные метрики, формулируй их абстрактно, без привязки к предметной области, используя следующие категории:

• Outcome metrics — отражают успешность основного сценария
(например: доля успешных завершений сценария)

• Quality metrics — отражают корректность и отказы
(например: распределение отказов по причинам)

• Performance metrics — отражают скорость получения результата
(например: время от инициации до результата, p50 / p95)

• Usage metrics (опционально) — отражают использование фичи
(например: доля пользователей, использующих функциональность)

• System health metrics (минимум) — ошибки и сбои выполнения

⚠️ Блок «Метрики успеха» обязателен для вывода, даже если пользователь не задал конкретные метрики.
В этом случае метрики формулируются абстрактно, через универсальные категории (Outcome, Quality, Performance).
Отсутствие блока метрик считается неполным результатом анализа.

⚠️ Не выдумывай числовые цели и SLA, если они не указаны.

4.2. In Scope / Out of Scope (принцип границ)

Если пользователь явно не задал границы, ты обязан:

• Явно фиксировать In Scope — что точно входит в текущую реализацию
• Явно фиксировать Out of Scope — что сознательно не реализуется

Формулировки должны:
• защищать от расширения требований;
• не добавлять новую функциональность;
• быть основаны только на входных данных.
Отсутствие явного блока Out of Scope при наличии неоднозначностей или потенциального расширения требований считается ошибкой анализа.


📌 5. Формат вывода (обязателен)

Всегда выводи блоки в Markdown с заголовками ### в следующем порядке:
⚠️ ВАЖНО: После каждого заголовка НЕ добавляй пустую строку. Сразу после заголовка должен идти контент без пустых строк между ними.

• Название и описание фичи
• Краткое резюме требований
• Уточняющие вопросы
• Acceptance Criteria
• Риски и потенциальные проблемы
• Тест-кейсы (если ≥ 2 кейсов)
• Рекомендации по автотестам

Дополнительно, если уместно или явно запрошено:
• Метрики успеха
• In Scope / Out of Scope
• Предположения
• User Flow
• Негативные и граничные сценарии

📌 6. Таблица тест-кейсов (строгий формат)

| ID | Название | Вход | Шаги | ОР | Тип |

Правила:
• шаги — только через <br>;
• без | внутри ячеек;
• без многострочного текста;
• формулировки короткие и проверяемые;
• роли и тарифы из KB учитываются, если KB включена.

📌 7. Поведение при нехватке данных

Если данных недостаточно:
• не выводи никакие блоки, кроме текста-заголовка, который должен быть на языке вывода:
  - Если language = "RU": "Чтобы выполнить анализ, нужны уточнения. Вопросы ниже:"
  - Если language = "EN": "To perform the analysis, clarifications are needed. Questions below:"
• затем — до 10 вопросов, сгруппированных по темам, все на языке вывода.
• В enterprise-lite вопросы глубже и структурнее.

📌 8. Запрещено

• UI / дизайн;
• техническая реализация;
• домысливание бизнес-логики;
• добавление новых фич;
• изменение логики;
• интерпретация ограничений без подтверждения.

📌 9. Язык вывода

⚠️ КРИТИЧЕСКИ ВАЖНО: Язык вывода ОБЯЗАТЕЛЬНО должен соответствовать параметру language, указанному в запросе.
• Если language = "RU" или "RU" — выводи результат на русском языке.
• Если language = "EN" или "EN" — выводи результат на английском языке.
• Если указан другой язык — выводи результат на соответствующем языке.
• НЕ используй язык входного описания фичи (feature) для определения языка вывода.
• Язык вывода определяется ТОЛЬКО параметром language из запроса.
`.trim();

// --- KB Files support (multipart/form-data) ---
const Busboy = require("busboy");
let mammoth, pdfParse, XLSX;
try { mammoth = require("mammoth"); } catch {}
try { pdfParse = require("pdf-parse"); } catch {}
try { XLSX = require("xlsx"); } catch {}

const KB_ALLOWED_EXT = [".pdf", ".docx", ".txt", ".xlsx", ".md"];
const KB_MAX_FILES = 3;
const KB_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file (Airtable uploadAttachment limit)
const airtableKbFilesField = process.env.AIRTABLE_KB_FILES_FIELD || "KB Files";

async function uploadAttachmentToAirtable({ token, baseId, recordId, fieldName, file }) {
  // ВАЖНО: uploadAttachment идёт через content.airtable.com и путь БЕЗ tableName
  const url = `https://content.airtable.com/v0/${baseId}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`;

  const payload = {
    filename: file.filename,
    contentType: file.mimeType || "application/octet-stream",
    file: file.buffer.toString("base64"),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Airtable uploadAttachment failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}



function safeJsonParse(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

function kbGetExt(filename) {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers["content-type"] || event.headers["Content-Type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return reject(new Error("Not multipart/form-data"));
    }

    const bb = Busboy({ headers: { "content-type": contentType } });
    const fields = {};
    const files = [];

    bb.on("field", (name, val) => { fields[name] = val; });

    bb.on("file", (name, file, info) => {
      const filename = info.filename || "unknown";
      const mimeType = info.mimeType || info.mime || "application/octet-stream";
      const chunks = [];
      let size = 0;

      file.on("data", (d) => {
        size += d.length;
        if (size > KB_MAX_FILE_SIZE) {
          // consume the stream to finish parsing, but ignore buffer
          file.resume();
          return;
        }
        chunks.push(d);
      });

      file.on("end", () => {
        files.push({
          fieldname: name,
          filename,
          mimeType,
          size,
          buffer: Buffer.concat(chunks),
        });
      });
    });

    bb.on("error", reject);
    bb.on("finish", () => resolve({ fields, files }));

    const body = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "", "utf8");

    bb.end(body);
  });
}

async function extractTextFromFile(file) {
  const ext = kbGetExt(file.filename);

  if (ext === ".txt" || ext === ".md") {
    return file.buffer.toString("utf8");
  }

  if (ext === ".docx") {
    if (!mammoth) return "[DOCX: не удалось извлечь текст (модуль mammoth не установлен)]";
    const res = await mammoth.extractRawText({ buffer: file.buffer });
    return res.value || "";
  }

  if (ext === ".pdf") {
    if (!pdfParse) return "[PDF: не удалось извлечь текст (модуль pdf-parse не установлен)]";
    const res = await pdfParse(file.buffer);
    return res.text || "";
  }

  if (ext === ".xlsx") {
    if (!XLSX) return "[XLSX: не удалось извлечь текст (модуль xlsx не установлен)]";
    const wb = XLSX.read(file.buffer, { type: "buffer" });
    const parts = [];
    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });
      parts.push(`### Sheet: ${sheetName}`);
      const slice = rows.slice(0, 50);
      for (const r of slice) {
        parts.push((r || []).map((c) => String(c ?? "")).join("\t"));
      }
      parts.push("");
    }
    return parts.join("\n");
  }

  return "";
}



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

  // Проверяем наличие обязательных переменных окружения
  if (!airtableToken || !baseId) {
    console.error("Missing Airtable config:", {
      hasToken: !!airtableToken,
      hasBaseId: !!baseId,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Airtable configuration missing",
        details:
          "AIRTABLE_TOKEN или AIRTABLE_BASE_ID не установлены в переменных окружения",
      }),
    };
  }

  let requestId = null;
  const startTime = Date.now(); // Время начала обработки запроса

  try {
    // Разбираем тело запроса (multipart preferred; JSON fallback)
    const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";

    let feature = "";
    let extraInfo = "";
    let kbLinks = [];
    let kbFiles = []; // legacy (JSON) / meta
    let language = "RU";
    let mode;
    let include = {};
    let parentRequestId = null;

    // Файлы KB (реальные байты) из multipart
    let uploadedKbFiles = [];

    if (contentType.includes("multipart/form-data")) {
      const { fields: mpFields, files: mpFiles } = await parseMultipart(event);

      feature = mpFields.feature || "";
      extraInfo = mpFields.extraInfo || "";
      language = mpFields.language || "RU";
      mode = mpFields.mode;
      parentRequestId = mpFields.parentRequestId || null;

      kbLinks = safeJsonParse(mpFields.kbLinks, []);
      include = safeJsonParse(mpFields.include, {});

      uploadedKbFiles = (mpFiles || []).filter((f) => f.fieldname === "kbFiles");
      // Для логов (и совместимости) формируем метаданные kbFiles
      kbFiles = uploadedKbFiles.map((f) => ({ name: f.filename, size: f.size, type: f.mimeType }));
    } else {
      const body = JSON.parse(event.body || "{}");
      ({
        feature,
        extraInfo = "",
        kbLinks = [],
        kbFiles = [],
        language = "RU",
        mode,
        include = {},
        parentRequestId = null,
      } = body);
    }
// Получаем информацию о пользователе (если есть в headers)
    const userAgent = event.headers?.['user-agent'] || event.headers?.['User-Agent'] || 'unknown';
    const userInfo = userAgent.substring(0, 100); // Ограничиваем длину

    // Нормализуем язык: приводим к верхнему регистру и проверяем допустимые значения
    const normalizedLanguage = (language || "RU").toUpperCase();
    const outputLanguage = normalizedLanguage === "EN" ? "EN" : "RU";

    const effectiveMode =
      mode === "enterprise-lite" ? "enterprise-lite" : "mvp";

    // Флаг использования базы знаний — с фронта
    const useKB = !!include.useKnowledgeBase;

    // KB для логирования в Airtable (всегда)
    const kbLinksForAirtable = kbLinks;
    const kbFilesForAirtable = kbFiles;

    // KB, которые реально пойдут в модель (если useKB = false — очищаем)
    const kbLinksForModel = useKB ? kbLinks : [];
    const kbFilesForModel = useKB ? kbFiles : [];

    // --- KB Files: validate + upload artifacts to Airtable + extract text for model ---
    let kbFilesText = "";
    if (useKB && uploadedKbFiles && uploadedKbFiles.length > 0) {
      // validate count
      if (uploadedKbFiles.length > KB_MAX_FILES) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: `Можно загрузить максимум ${KB_MAX_FILES} файлов.` }),
        };
      }

      for (const f of uploadedKbFiles) {
        const ext = kbGetExt(f.filename);
        if (!KB_ALLOWED_EXT.includes(ext)) {
          return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: `Недопустимый формат файла: ${f.filename}. Разрешены: ${KB_ALLOWED_EXT.join(", ")}` }),
          };
        }
        if (f.size > KB_MAX_FILE_SIZE) {
          return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: `Файл слишком большой: ${f.filename}. Макс размер: 5 MB.` }),
          };
        }
      }
    }

    // 0. Получаем контент из ссылок базы знаний (если включена опция и есть ссылки)
    let kbContent = "";
    if (useKB && kbLinksForModel && kbLinksForModel.length > 0) {
      console.log(
        `Fetching content from ${kbLinksForModel.length} KB links...`
      );
      try {
        // Загружаем все URL параллельно, каждый с таймаутом 5 секунд
        // Это ограничивает общее время на KB (максимум ~5 секунд для всех URL)
        const kbTexts = await Promise.all(
          kbLinksForModel.map(async (url) => {
            try {
              const content = await fetchWebContent(url);
              return `---\nИсточник: ${url}\n\n${content}\n---\n`;
            } catch (err) {
              console.error(`Failed to fetch ${url}:`, err.message);
              return `---\nИсточник: ${url}\n\n[Не удалось получить содержимое: ${err.message}]\n---\n`;
            }
          })
        );
        kbContent = "\n\n" + kbTexts.join("\n\n");
      } catch (err) {
        console.error("Error fetching KB content:", err);
        kbContent = "\n\n[Ошибка при получении содержимого базы знаний]";
      }
    }

    // 1. создаём запись в Airtable со статусом in_progress
    // Ограничиваем длину полей для предотвращения ошибок Airtable
    const maxTextFieldLength = 100000; // Максимальная длина текстового поля в Airtable
    const maxSingleLineLength = 5000; // Максимальная длина однострочного поля
    
    const featureDescription = (feature || "").substring(0, maxTextFieldLength);
    const kbLinksText = kbLinksForAirtable.join("\n").substring(0, maxSingleLineLength);
    
    // Форматируем текущую дату для Airtable (формат YYYY-MM-DD для Date field)
    const currentDate = new Date().toISOString().split('T')[0]; // Получаем только дату без времени
    
    const fields = {
      "Feature Description": featureDescription,
      "KB Links": kbLinksText,
      "Language": outputLanguage,
      "Include Questions": !!include.questions,
      "Include Acceptance Criteria": !!include.acceptanceCriteria,
      "Include Test Cases": !!include.testCases,
      "Include Negative Scenarios": !!include.negativeScenarios,
      "Include Out Of Scope": !!include.outOfScope,
      "Use Knowledge Base": useKB,
      "Mode": effectiveMode,
      "Status": "in_progress",
      "Created Date": currentDate, // Date field: формат YYYY-MM-DD
      "Generation Time (seconds)": 0, // Number field: будет обновлено позже
    };

    const apiUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      requestsTable
    )}`;
    
    console.log("Creating Airtable record:", {
      baseId,
      tableName: requestsTable,
      url: apiUrl,
      fieldsSummary: {
        featureLength: fields["Feature Description"]?.length || 0,
        kbLinksCount: kbLinksForAirtable.length,
        kbLinksTextLength: fields["KB Links"]?.length || 0,
        useKB: fields["Use Knowledge Base"],
        mode: fields["Mode"],
      },
    });

    let createRes;
    let created;
    
    try {
      createRes = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      });

      created = await createRes.json();
    } catch (fetchError) {
      console.error("Network error when creating Airtable record:", fetchError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Network error when creating Airtable record",
          details: fetchError.message,
        }),
      };
    }

    if (!createRes.ok) {
      console.error("Airtable create error:", {
        status: createRes.status,
        statusText: createRes.statusText,
        response: created,
        baseId,
        tableName: requestsTable,
        fieldsKeys: Object.keys(fields),
        fieldsTypes: Object.entries(fields).reduce((acc, [key, value]) => {
          acc[key] = typeof value;
          return acc;
        }, {}),
      });

      let errorDetails = "Неизвестная ошибка Airtable";
      if (created.error === "NOT_FOUND") {
        errorDetails = `Таблица "${requestsTable}" не найдена в базе "${baseId}". Проверьте имя таблицы и BASE_ID.`;
      } else if (created.error === "UNAUTHORIZED") {
        errorDetails = "Неверный токен доступа. Проверьте AIRTABLE_TOKEN.";
      } else if (created.error?.type === "INVALID_VALUE_FOR_COLUMN") {
        errorDetails = `Неверное значение для колонки: ${created.error.message || "проверьте типы данных полей"}`;
      } else if (created.error) {
        // Правильно сериализуем ошибку
        if (typeof created.error === "string") {
          errorDetails = `Ошибка Airtable: ${created.error}`;
        } else if (created.error.message) {
          errorDetails = `Ошибка Airtable: ${created.error.message}`;
        } else {
          errorDetails = `Ошибка Airtable: ${JSON.stringify(created.error)}`;
        }
      }

      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Airtable create failed",
          airtable: {
            error: typeof created.error === "string" ? created.error : (created.error?.message || JSON.stringify(created.error)),
            type: created.error?.type,
          },
          details: errorDetails,
          config: {
            baseId: baseId ? `${baseId.substring(0, 8)}...` : "не установлен",
            tableName: requestsTable,
          },
        }),
      };
    }
    
    requestId = created.id;
    
    // Обновляем запись с Request ID
    try {
      const requestIdUpdateRes = await fetch(
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
              "Request ID": requestId,
            },
          }),
        }
      );
      
      if (!requestIdUpdateRes.ok) {
        const errorData = await requestIdUpdateRes.json().catch(() => ({}));
        console.warn("Failed to update Request ID field:", {
          status: requestIdUpdateRes.status,
          error: errorData,
        });
      }
    } catch (e) {
      console.warn("Failed to update Request ID field (network error):", e.message);
    }
    
    console.log("Airtable record created successfully:", {
      requestId: created.id,
      createdTime: created.createdTime,
      user: userInfo,
    });

    // Загружаем KB файлы в Airtable как артефакты (Attachment field: "KB Files")
    // и извлекаем текст для передачи в модель (учитывается аналогично ссылкам)
    if (useKB && uploadedKbFiles && uploadedKbFiles.length > 0) {
      const extractedParts = [];
      for (const f of uploadedKbFiles) {
        try {
          await uploadAttachmentToAirtable({ token: airtableToken, baseId, recordId: requestId, fieldName: airtableKbFilesField, file: f });
        } catch (e) {
          console.error("Failed to upload KB file to Airtable:", { file: f.filename, error: e.message });
          // Не валим генерацию полностью: продолжаем, но текст файла всё равно попробуем извлечь
        }

        try {
          const text = await extractTextFromFile(f);
          if (text && text.trim()) {
            extractedParts.push(`---\nФайл: ${f.filename}\n\n${text.trim()}\n---`);
          }
        } catch (e) {
          console.error("Failed to extract text from KB file:", { file: f.filename, error: e.message });
        }
      }

      kbFilesText = extractedParts.join("\n\n");

      // (Опционально) сохраняем извлечённый текст в Airtable (Long text field "KB Files Text")
      if (kbFilesText) {
        try {
          await fetch(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(requestsTable)}/${requestId}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${airtableToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fields: {
                  "KB Files Text": kbFilesText.substring(0, 100000),
                },
              }),
            }
          );
        } catch (e) {
          console.warn("Failed to save KB Files Text:", e.message);
        }
      }
    }


    // Флаг для отслеживания таймаута
    let isTimedOut = false;
    
    // Устанавливаем таймер для автоматической установки Status = failed при приближении таймаута
    // Netlify CLI локально имеет таймаут 30 секунд, поэтому устанавливаем на 25 секунд
    // В продакшене таймаут 180 секунд, поэтому там будет 175 секунд
    const timeoutWarning = setTimeout(async () => {
      isTimedOut = true;
      const timeoutGenerationTime = Math.round((Date.now() - startTime) / 1000);
      
      console.warn("Function execution is taking too long, marking as failed in Airtable", {
        id: requestId,
        user: userInfo,
        generationTime: `${timeoutGenerationTime}s`,
        status: "failed",
      });
      
      try {
        await markRequestFailed(
          baseId,
          requestsTable,
          airtableToken,
          requestId,
          timeoutGenerationTime
        );
      } catch (e) {
        console.error("Failed to mark request as failed in timeout handler:", e);
      }
    }, process.env.NETLIFY_DEV ? 25000 : 290000); // 25 секунд для локального Netlify CLI (таймаут 30 сек), 290 секунд для продакшена (таймаут 300 сек)

    // 2. вызываем OpenAI
    // Формируем промпт с учетом режима, флагов и (опционально) базы знаний
    
    // Определяем язык вывода для явного указания в промпте
    const outputLanguageName = outputLanguage === "EN" ? "английском" : "русском";
    
    // Определяем примеры текста для разных языков
    const clarificationText = outputLanguage === "EN" 
      ? "To perform the analysis, clarifications are needed. Questions below:"
      : "Чтобы выполнить анализ, нужны уточнения. Вопросы ниже:";
    
    let userPrompt =
      `⚠️ КРИТИЧЕСКИ ВАЖНО: Результат анализа ОБЯЗАТЕЛЬНО должен быть на ${outputLanguageName} языке (language=${outputLanguage}).\n` +
      `Независимо от языка входного описания фичи, ВЕСЬ вывод должен быть на ${outputLanguageName} языке:\n` +
      `- Все заголовки и подзаголовки\n` +
      `- Весь текст, включая вводные фразы\n` +
      `- Все вопросы\n` +
      `- Все критерии приемки\n` +
      `- Все тест-кейсы\n` +
      `- Все метрики и рекомендации\n` +
      `- Если данных недостаточно, используй этот текст на ${outputLanguageName} языке: "${clarificationText}"\n` +
      `Если входное описание на другом языке - это не имеет значения, вывод должен быть на ${outputLanguageName} языке.\n\n` +
      `Параметры запроса:\n` +
      `- mode: ${effectiveMode}\n` +
      `- language: ${outputLanguage} (язык вывода результата - ОБЯЗАТЕЛЬНО использовать этот язык для ВСЕГО текста)\n` +
      `- include: ${JSON.stringify(include)}\n` +
      `- useKnowledgeBase: ${useKB}\n` +
      `- kbLinksCount: ${kbLinksForModel.length}\n` +
      `- kbFilesCount: ${kbFilesForModel.length}\n\n` +
      `Описание фичи:\n${feature || ""}`;

    if (extraInfo) {
      userPrompt += `\n\nДополнительная информация:\n${extraInfo}`;
    }
    if (kbContent || kbFilesText) {
      userPrompt += "\n\nБаза знаний (контекст для анализа, если она включена):";
      if (kbContent) userPrompt += kbContent;
      if (kbFilesText) userPrompt += "\n\n[KB файлы]\n" + kbFilesText;
    }

    // Вызываем OpenAI API (используется общий таймаут функции - 3 минуты)
    let openaiRes;
    let openaiData;
    
    try {
      openaiRes = await fetch(
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
              { role: "user", content: userPrompt },
            ],
        }),
      }
      );

      // Пытаемся получить текст ответа для проверки формата
      const responseText = await openaiRes.text();

      // Пытаемся распарсить JSON
      try {
        openaiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("OpenAI response is not JSON:", responseText.substring(0, 200));
        const parseErrorGenerationTime = Math.round((Date.now() - startTime) / 1000);
        await markRequestFailed(
          baseId,
          requestsTable,
          airtableToken,
          requestId,
          parseErrorGenerationTime
        );
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            error: "OpenAI response parsing failed",
            details: "Сервер OpenAI вернул ответ в неожиданном формате. Возможно, произошла ошибка на стороне сервера или превышено время ожидания.",
            requestId 
          }),
        };
      }

      if (!openaiRes.ok) {
        console.error("OpenAI error:", openaiData);
        // помечаем запрос как failed
        const openaiErrorGenerationTime = Math.round((Date.now() - startTime) / 1000);
        await markRequestFailed(
          baseId,
          requestsTable,
          airtableToken,
          requestId,
          openaiErrorGenerationTime
        );
        
        let errorMessage = "Ошибка при обращении к OpenAI API";
        let errorDetails = "Не удалось получить ответ от сервера генерации";
        
        if (openaiData?.error?.message) {
          errorDetails = openaiData.error.message;
        } else if (openaiData?.error) {
          errorDetails = JSON.stringify(openaiData.error);
        }
        
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            error: errorMessage,
            details: errorDetails,
            requestId 
          }),
        };
      }
    } catch (fetchError) {
      console.error("OpenAI fetch error:", fetchError);
      
      // Помечаем запрос как failed
      const fetchErrorGenerationTime = Math.round((Date.now() - startTime) / 1000);
      await markRequestFailed(
        baseId,
        requestsTable,
        airtableToken,
        requestId,
        fetchErrorGenerationTime
      );
      
      let errorMessage = "Ошибка сети при обращении к OpenAI";
      let errorDetails = "Не удалось установить соединение с сервером генерации";
      
      if (fetchError.name === "AbortError" || fetchError.message.includes("timeout")) {
        errorMessage = "Превышено время ожидания";
        errorDetails = "Запрос к серверу генерации занял слишком много времени и был прерван. Попробуйте упростить запрос или повторить попытку позже.";
      } else if (fetchError.message) {
        errorDetails = fetchError.message;
      }
      
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
          requestId 
        }),
      };
    }

    // Очищаем таймер, так как мы успешно получили ответ
    clearTimeout(timeoutWarning);
    
    // Проверяем, не произошел ли таймаут
    if (isTimedOut) {
      const timeoutGenerationTime = Math.round((Date.now() - startTime) / 1000);
      
      console.warn("Timeout occurred, not updating status to 'done'", {
        id: requestId,
        user: userInfo,
        generationTime: `${timeoutGenerationTime}s`,
        status: "failed",
      });
      
      // Не обновляем статус, так как он уже установлен в "failed" таймером
      // Но все равно возвращаем ошибку клиенту
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Превышено время ожидания",
          details: "Генерация требований заняла слишком много времени и была прервана. Попробуйте упростить описание фичи или повторить попытку позже.",
          requestId
        }),
      };
    }

    const rawMarkdown =
      openaiData.choices?.[0]?.message?.content?.trim() ||
      "Модель вернула пустой ответ.";

    const markdown = normalizeMarkdown(rawMarkdown);


    // Вычисляем время генерации в секундах
    const endTime = Date.now();
    const generationTimeSeconds = Math.round((endTime - startTime) / 1000);

    // 3. обновляем запись в Airtable результатом
    // Airtable имеет ограничение на длину текстового поля (100,000 символов для long text)
    // Обрезаем результат, если он слишком длинный
    const maxLength = 100000;
    const markdownForAirtable =
      markdown.length > maxLength
        ? markdown.substring(0, maxLength - 100) +
          "\n\n[Результат обрезан из-за ограничения длины поля Airtable]"
        : markdown;

    // Логируем информацию о записи
    console.log("Request completed:", {
      id: requestId,
      user: userInfo,
      generationTime: `${generationTimeSeconds}s`,
      status: "done",
    });

    
    // 3. обновляем запись в Airtable результатом
    try {
      const updateUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(requestsTable)}/${requestId}`;
      const updateRes = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Result Markdown": markdownForAirtable,
            "Status": "done",
            "Generation Time (seconds)": generationTimeSeconds,
          },
        }),
      });

      const updateText = await updateRes.text();
      let updateData = {};
      try { updateData = JSON.parse(updateText); } catch {}

      if (!updateRes.ok) {
        console.error("Airtable update error:", {
          status: updateRes.status,
          statusText: updateRes.statusText,
          response: updateData,
          requestId,
        });
        console.warn("Не удалось обновить запись в Airtable, но результат получен успешно");
      } else {
        console.log("Airtable record updated successfully:", {
          requestId,
          markdownLength: markdown.length,
          generationTime: `${generationTimeSeconds}s`,
        });
      }
    } catch (updateError) {
      console.error("Airtable update fetch error:", updateError);
      console.warn("Не удалось обновить запись в Airtable из-за сетевой ошибки, но результат получен успешно");
    }

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
    // Очищаем таймер при ошибке
    if (typeof timeoutWarning !== 'undefined') {
      clearTimeout(timeoutWarning);
    }
    
    const errorGenerationTime = Math.round((Date.now() - startTime) / 1000);
    
    console.error("generate handler error:", {
      error: err.message,
      name: err.name,
      id: requestId,
      user: userInfo,
      generationTime: `${errorGenerationTime}s`,
      status: "failed",
    });

    if (requestId) {
      try {
        await markRequestFailed(
          process.env.AIRTABLE_BASE_ID,
          process.env.AIRTABLE_REQUESTS_TABLE || "Requests",
          process.env.AIRTABLE_TOKEN,
          requestId,
          errorGenerationTime
        );
      } catch (e) {
        console.error(
          "failed to mark request as failed in Airtable:",
          e
        );
      }
    }

    let errorMessage = "Внутренняя ошибка сервера";
    let errorDetails = "Произошла непредвиденная ошибка при обработке запроса";
    
    if (err.name === "AbortError" || err.message?.includes("timeout") || err.name === "TimeoutError") {
      errorMessage = "Превышено время ожидания";
      errorDetails = "Обработка запроса заняла слишком много времени и была прервана. Попробуйте упростить запрос или повторить попытку позже.";
    } else if (err.message) {
      errorDetails = err.message;
    }

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        requestId: requestId || null
      }),
    };
  }
};

async function markRequestFailed(baseId, tableName, token, recordId, generationTimeSeconds = null) {
  if (!baseId || !tableName || !token || !recordId) {
    console.warn("markRequestFailed: missing parameters", {
      hasBaseId: !!baseId,
      hasTableName: !!tableName,
      hasToken: !!token,
      hasRecordId: !!recordId,
    });
    return;
  }
  
  try {
    const fieldsToUpdate = {
      Status: "failed",
    };
    
    // Обновляем время генерации, если оно передано
    if (generationTimeSeconds !== null) {
      fieldsToUpdate["Generation Time (seconds)"] = generationTimeSeconds;
    }
    
    const res = await fetch(
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
          fields: fieldsToUpdate,
        }),
      }
    );
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to mark request as failed in Airtable:", {
        status: res.status,
        statusText: res.statusText,
        response: errorText.substring(0, 200),
      });
    }
  } catch (e) {
    console.error("Error marking request as failed:", e);
  }
}

// Функция для получения текстового содержимого веб-страницы (KB link)
async function fetchWebContent(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут на URL

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AI Requirements Generator/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Простой парсинг HTML для извлечения текста
    // Убираем теги script, style, noscript
    let text = html
      .replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      )
      .replace(
        /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
        ""
      )
      .replace(
        /<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi,
        ""
      )
      .replace(/<[^>]+>/g, " ") // Убираем все оставшиеся HTML теги
      .replace(/\s+/g, " ") // Нормализуем пробелы
      .trim();

    // Ограничиваем размер контента (первые 8000 символов)
    if (text.length > 8000) {
      text = text.substring(0, 8000) + "... [содержимое обрезано]";
    }

    return text || "[Не удалось извлечь текстовое содержимое]";
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(
        "Превышено время ожидания при получении страницы"
      );
    }
    throw new Error(
      `Ошибка при получении страницы: ${error.message}`
    );
  }
}

function normalizeMarkdown(md) {
  if (!md) return md;

  let s = md;

  // 1) Сжимаем "много пустых строк" до одной пустой строки между блоками
  s = s.replace(/\n{3,}/g, "\n\n");

  // 2) Убираем пустую строку сразу после заголовка (чтобы не было отступа "Блок\n\n-текст")
  // Пример: "## Заголовок\n\nтекст" -> "## Заголовок\nтекст"
  s = s.replace(/(\n#{1,6}\s+[^\n]+)\n\n+/g, "$1\n");

  // 3) Если где-то получилось "пустая строка перед заголовком" — оставляем максимум одну
  s = s.replace(/\n{2,}(?=\n#{1,6}\s)/g, "\n\n");

  return s.trim();
}


// ---------------- i18n (UI language) ----------------
const I18N = {
  en: {
    app_title: "AI Requirements Generator",
    app_subtitle:
      "Create a structured first draft of requirements, acceptance criteria and test cases based on the feature description and knowledge base.",
    feature_title: "Feature description",
    feature_subtitle: "Describe the feature as you would explain it to your dev team.",
    feature_placeholder:
      "Describe the feature as you would explain it to your dev team.\n\nInclude:\n– feature goal\n– target users\n– main user flow\n– constraints or edge cases (if any)\n\n5–10 sentences is usually enough.",
    kb_title: "Knowledge base",
    kb_subtitle: "Optional. Helps align the feature with the current product.",
    kb_collapse: "Collapse",
    kb_expand: "Expand",
    links_label: "Links",
    links_placeholder: "Enter a link and press Enter or comma...",
    links_hint:
      "You can add links to docs, Confluence, Notion, etc. Use Ctrl+Click to open a link.",
    kb_files_label: "Knowledge base files (PDF, DOCX, TXT, XLSX, MD)",
    kb_files_hint: "Up to 3 files, max 5 MB each.",
    include_label: "What to include in generation",
    inc_questions: "Clarifying questions",
    inc_ac: "Acceptance Criteria",
    inc_tc: "Test cases",
    inc_neg: "Negative scenarios",
    inc_oos: "Out of Scope",
    output_lang_label: "Output language",
    analysis_mode_label: "Analysis mode",
    analysis_mode_mvp: "Standard (MVP)",
    analysis_mode_enterprise: "Enterprise",
    btn_generate: "Create first draft",
    result_title: "Draft result",
    result_subtitle:
      "This is a first draft to help you start. Review and adapt it before use.",
    result_empty: "Empty so far — enter a feature description and run generation.",
    extra_label: "Additional information / answers to clarifying questions",
    extra_placeholder:
      "After the first run, you can add answers to clarifying questions or extra details here.",
    extra_hint: "This information will be used in the next generation.",
    btn_refine: "Refine",
    save_label: "Save result",
    save_opt_txt: "Text file (.txt)",
    save_btn: "Save file",
    save_hint:
      "File name = feature name. For Word/PDF/Excel in this MVP, the system downloads a .txt file.",
    feedback_title: "Feedback",
    feedback_subtitle: "Helps improve the prompt and output quality.",
    fb_rating_label: "Rating",
    fb_rating_placeholder: "Select rating",
    fb_email_label: "Email (optional)",
    fb_email_placeholder: "For follow-up on important cases",
    fb_woulduse_label: "Would you use this in real work? Why yes/no?",
    fb_not_selected: "Not selected",
    fb_yes: "Yes",
    fb_no: "No",
    fb_not_sure: "Not sure",
    fb_woulduse_why_placeholder: "Why yes/no?",
    fb_manual_label: "What would require a lot of manual editing?",
    fb_manual_placeholder: "Describe what you would need to change/add manually",
    fb_extra_label: "What feels unnecessary?",
    fb_extra_placeholder: "What to remove/simplify",
    fb_where_label: "Where do you do this manually today?",
    fb_where_placeholder: "Tools/processes: Notion, Confluence, Jira, Docs, etc.",
    fb_wontpay_label: "What would you definitely not pay for?",
    fb_wontpay_placeholder: "What has no value / is not worth paying for",
    fb_upset_label:
      "If the service shuts down tomorrow, would you be upset?",
    fb_submit: "Send feedback",

    // Tooltips (HTML)
    kb_tooltip_html:
      "<div class='tt-title'>Knowledge base</div><div class='tt-muted'>Additional context (docs, Confluence, Notion, etc.). Used only as a source of facts, without assumptions.</div><div><strong>Links</strong> add context from external sources.</div><div style='margin-top:6px;'><strong>Files</strong> are used as context during analysis. File contents are not copied into the output.</div>",
    include_tooltip_html:
      "<div class='tt-title'>Generation options</div><div>Select which blocks to include in the final output.</div><div style='margin-top:6px;'>See details for each item via the ⓘ icon on the right.</div>",
    tt_questions_html:
      "<div class='tt-title'>Clarifying questions</div><div>Questions needed to correctly specify requirements.</div>",
    tt_ac_html:
      "<div class='tt-title'>Acceptance Criteria</div><div>Formal, testable acceptance conditions for the feature.</div>",
    tt_tc_html:
      "<div class='tt-title'>Test cases</div><div>Core scenarios to verify the requirements.</div>",
    tt_neg_html:
      "<div class='tt-title'>Negative and edge scenarios</div><div>Errors and edge cases.</div>",
    tt_oos_html:
      "<div class='tt-title'>Out of Scope</div><div>What is not included in the current implementation.</div>",
    output_lang_tooltip_html:
      "<div class='tt-title'>Output language</div><div class='tt-muted'>Controls the language of the generated result. By default it matches the UI language, but you can change it independently.</div>",
    analysis_mode_tooltip_html:
      "<div class='tt-title'>Analysis mode</div><div>Defines the depth and strictness of the output.</div><div style='margin-top:6px;'>The system uses only data from the description and knowledge base, without adding functionality without confirmation.</div><div style='margin-top:10px;'><strong>Standard (MVP)</strong></div><ul><li>Concise and practical spec</li><li>Focus on core requirements</li><li>Minimum clarifying questions</li><li>Good for quick analysis and MVP</li></ul><div style='margin-top:10px;'><strong>Enterprise</strong></div><ul><li>Stricter and more detailed analysis</li><li>Risks and edge scenarios</li><li>More clarifying questions</li><li>Good for complex features</li></ul>",

    // Runtime messages
    msg_delete: "Remove",
    alert_max_files: "You can add up to 3 knowledge base files.",
    alert_files_too_big:
      "File(s) exceed 5 MB and will not be added:",
    alert_duplicate_files: "File is already uploaded and won't be added again:",
    status_generating_long: "Generating a draft of requirements, acceptance criteria, and test cases. This will take ~30–60 seconds",
    err_generic_title: "Generation failed",
    err_generic_details: "Server returned an unexpected response format.",
    err_timeout_title: "Request timed out",
    err_timeout_details:
      "Generation took too long and was interrupted. Try simplifying the feature description or retry later.",
    err_network_title: "Network error",
    err_network_details:
      "Could not connect to the server. Check your internet connection and try again.",
    fb_insert_image_not_supported:
      "Image paste is not supported. Please use text only.",
    fb_drag_image_not_supported:
      "Image drag-and-drop is not supported. Please use text only.",
    fb_select_rating: "Please select a rating.",
    fb_invalid_email:
      "Please enter a valid email address or leave the field empty.",
    fb_sending: "Sending...",
    fb_success: "Thanks! Your feedback has been submitted.",
    fb_error_prefix: "Error:",
    fb_try_again: "Please try again.",
  },
  ru: {
    app_title: "AI Requirements Generator",
    app_subtitle:
      "Превратите идею фичи в структурированный черновик требований, acceptance criteria и тест-кейсов.",
    feature_title: "Описание фичи",
    feature_subtitle: "Опишите фичу так, как вы бы объясняли её команде разработки.",
    feature_placeholder:
      "Опишите фичу так, как вы бы объясняли её команде разработки.\n\nУкажите:\n– цель фичи\n– пользователей\n– основной пользовательский сценарий\n– ограничения или edge cases (если есть)\n\nОбычно достаточно 5–10 предложений.",
    kb_title: "База знаний",
    kb_subtitle: "Опционально. Помогает согласовать фичу с текущим продуктом.",
    kb_collapse: "Свернуть",
    kb_expand: "Развернуть",
    links_label: "Ссылки",
    links_placeholder: "Введите ссылку и нажмите Enter или запятую...",
    links_hint:
      "Можно добавить ссылки на документацию, Confluence, Notion и т.п. Ctrl+Click для открытия ссылки.",
    kb_files_label: "Файлы базы знаний (PDF, DOCX, TXT, XLSX, MD)",
    kb_files_hint: "До 3 файлов, максимум 5 MB каждый.",
    include_label: "Что включать в генерацию",
    inc_questions: "Уточняющие вопросы",
    inc_ac: "Acceptance Criteria",
    inc_tc: "Тест-кейсы",
    inc_neg: "Негативные сценарии",
    inc_oos: "Out of Scope",
    output_lang_label: "Язык результата",
    analysis_mode_label: "Режим анализа",
    analysis_mode_mvp: "Стандартный (MVP)",
    analysis_mode_enterprise: "Enterprise",
    btn_generate: "Создать черновик",
    result_title: "Черновик",
    result_subtitle:
      "Это черновик, который помогает начать работу. Проверьте и адаптируйте перед использованием.",
    result_empty:
      "Пока пусто — введите описание фичи и создайте черновик.",
    extra_label: "Дополнительная информация / ответы на уточняющие вопросы",
    extra_placeholder:
      "После первого прогона сюда можно вписать ответы на уточняющие вопросы или дополнительные детали по фиче.",
    extra_hint: "Эта информация будет учитываться при следующей генерации.",
    btn_refine: "Уточнить",
    save_label: "Сохранить результат",
    save_opt_txt: "Текстовый файл (.txt)",
    save_btn: "Сохранить файл",
    save_hint:
      "Имя файла = название фичи. Для Word/PDF/Excel в текущем MVP сохраняется текстовый файл (.txt).",
    feedback_title: "Обратная связь",
    feedback_subtitle: "Помогает улучшать промпт и качество генерации.",
    fb_rating_label: "Оценка",
    fb_rating_placeholder: "Выберите оценку",
    fb_email_label: "Email (необязательно)",
    fb_email_placeholder: "Для связи по важным кейсам",
    fb_woulduse_label:
      "Ты бы стал(а) использовать это в реальной работе? Почему да / нет?",
    fb_not_selected: "Не выбрано",
    fb_yes: "Да",
    fb_no: "Нет",
    fb_not_sure: "Не уверен(а)",
    fb_woulduse_why_placeholder: "Почему да / нет?",
    fb_manual_label: "Что пришлось бы сильно допиливать руками?",
    fb_manual_placeholder: "Опиши, что именно пришлось бы править/дополнять",
    fb_extra_label: "Что лишнее?",
    fb_extra_placeholder: "Что убрать/упростить",
    fb_where_label: "Где ты сейчас делаешь это вручную?",
    fb_where_placeholder:
      "Инструменты/процессы: Notion, Confluence, Jira, Docs и т.п.",
    fb_wontpay_label: "За что точно не стал(а) бы платить?",
    fb_wontpay_placeholder: "Что не имеет ценности/не стоит денег",
    fb_upset_label: "Если завтра сервис закроется — ты расстроишься?",
    fb_submit: "Отправить фидбек",

    kb_tooltip_html:
      "<div class='tt-title'>База знаний</div><div class='tt-muted'>Дополнительный контекст (документация, Confluence, Notion и т.п.). Используется только как источник фактов, без домыслов.</div><div><strong>Ссылки</strong> — добавляют контекст из внешних источников.</div><div style='margin-top:6px;'><strong>Файлы</strong> — используются как контекст при анализе. Содержимое файлов не вставляется в результат напрямую.</div>",
    include_tooltip_html:
      "<div class='tt-title'>Опции генерации</div><div>Выберите, какие блоки включать в итоговый результат.</div><div style='margin-top:6px;'>Подсказки по каждому элементу — по иконке ⓘ справа.</div>",
    tt_questions_html:
      "<div class='tt-title'>Уточняющие вопросы</div><div>Вопросы, без которых нельзя корректно описать требования.</div>",
    tt_ac_html:
      "<div class='tt-title'>Acceptance Criteria</div><div>Формализованные условия приёмки фичи.</div>",
    tt_tc_html:
      "<div class='tt-title'>Тест-кейсы</div><div>Базовые сценарии проверки требований.</div>",
    tt_neg_html:
      "<div class='tt-title'>Негативные и граничные сценарии</div><div>Ошибки и крайние случаи.</div>",
    tt_oos_html:
      "<div class='tt-title'>Out of Scope</div><div>То, что не входит в текущую реализацию.</div>",
    output_lang_tooltip_html:
      "<div class='tt-title'>Язык результата</div><div class='tt-muted'>Определяет язык результата. По умолчанию совпадает с языком интерфейса, но его можно менять отдельно.</div>",
    analysis_mode_tooltip_html:
      "<div class='tt-title'>Режим анализа</div><div>Режим анализа определяет глубину и строгость генерации требований.</div><div style='margin-top:6px;'>Система использует только данные из описания и базы знаний, не дополняя функциональность без подтверждения.</div><div style='margin-top:10px;'><strong>Стандартный (MVP)</strong></div><ul><li>Краткое и практичное ТЗ</li><li>Фокус на ключевых требованиях</li><li>Минимум уточняющих вопросов</li><li>Подходит для быстрого анализа и MVP</li></ul><div style='margin-top:10px;'><strong>Enterprise</strong></div><ul><li>Более строгий и детализированный анализ</li><li>Риски и граничные сценарии</li><li>Больше уточняющих вопросов</li><li>Подходит для сложных фич</li></ul>",

    msg_delete: "Удалить",
    alert_max_files: "Можно добавить максимум 3 файла базы знаний.",
    alert_files_too_big: "Файл(ы) превышают 5 MB и не будут добавлены:",
    alert_duplicate_files:
      "Файл уже загружен и не будет добавлен повторно:",
    status_generating_long: "Генерируем черновик требований, AC и тест-кейсов. Это займёт ~30–60 секунд",
    err_generic_title: "Генерация не отработала",
    err_generic_details: "Сервер вернул ответ в неожиданном формате",
    err_timeout_title: "Превышено время ожидания",
    err_timeout_details:
      "Генерация требований заняла слишком много времени и была прервана. Попробуйте упростить описание фичи или повторить попытку позже.",
    err_network_title: "Ошибка сети",
    err_network_details:
      "Не удалось установить соединение с сервером. Проверьте подключение к интернету и попробуйте снова.",
    fb_insert_image_not_supported:
      "Вставка изображений не поддерживается. Пожалуйста, используйте только текст.",
    fb_drag_image_not_supported:
      "Перетаскивание изображений не поддерживается. Пожалуйста, используйте только текст.",
    fb_select_rating: "Пожалуйста, выберите оценку.",
    fb_invalid_email:
      "Пожалуйста, введите корректный email адрес или оставьте поле пустым.",
    fb_sending: "Отправка...",
    fb_success: "Спасибо! Ваш фидбек успешно отправлен.",
    fb_error_prefix: "Ошибка:",
    fb_try_again: "Пожалуйста, попробуйте еще раз.",
  },
};

function getUiLocale() {
  const saved = localStorage.getItem("uiLocale");
  return saved === "ru" ? "ru" : "en";
}

function setUiLocale(locale) {
  localStorage.setItem("uiLocale", locale);
}

function t(key) {
  const locale = getUiLocale();
  return (I18N[locale] && I18N[locale][key]) || I18N.en[key] || key;
}

function applyTranslations() {
  const locale = getUiLocale();
  const dict = I18N[locale] || I18N.en;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    if (dict[key] != null) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (!key) return;
    if (dict[key] != null) el.innerHTML = dict[key];
  });

  // keep KB collapse button label consistent with state
  const kbContent = document.getElementById("kbContent");
  const kbToggleLabel = document.querySelector("#kbToggle span[data-i18n]");
  if (kbToggleLabel && kbContent) {
    const isCollapsed = kbContent.classList.contains("collapsed");
    kbToggleLabel.textContent = isCollapsed ? t("kb_expand") : t("kb_collapse");
  }
}

// ---------------- UI locale & output language sync ----------------
function defaultOutputLangForLocale(locale) {
  return locale === "ru" ? "RU" : "EN";
}

function syncOutputLanguageToUi() {
  const outputSelect = document.getElementById("language");
  if (!outputSelect) return;
  outputSelect.value = defaultOutputLangForLocale(getUiLocale());
}

function initLanguageControls() {
  const uiSelect = document.getElementById("uiLanguage");
  const outputSelect = document.getElementById("language");
  if (uiSelect) {
    uiSelect.value = getUiLocale();
    uiSelect.addEventListener("change", () => {
      setUiLocale(uiSelect.value);
      applyTranslations();
      // per spec: when UI language changes, reset output language to match UI
      syncOutputLanguageToUi();
    });
  }

  // default output language must match UI language on load
  if (outputSelect) {
    syncOutputLanguageToUi();
  }
}

// Initial i18n apply
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  initLanguageControls();
});

// --- Tooltip icons: do not toggle checkboxes when clicking ⓘ inside labels ---
document.addEventListener("mousedown", (e) => {
  if (e.target && e.target.closest && e.target.closest(".info-icon")) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

document.addEventListener("click", (e) => {
  if (e.target && e.target.closest && e.target.closest(".info-icon")) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

// Генерация


// --- Knowledge Base files (max 3, max 5MB each): show list + allow remove + validations ---
const kbFilesInputEl = document.getElementById("kbFiles");
const kbFilesListEl = document.getElementById("kbFilesList");

const KB_MAX_FILES = 3;
const KB_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// We keep our own list so user can add files in несколько заходов (не перетирая предыдущий выбор).
let kbSelectedFiles = [];

function kbFilesKey(f) {
  return `${f.name}__${f.size}__${f.lastModified}`;
}

function syncKbInputFiles() {
  const dt = new DataTransfer();
  kbSelectedFiles.forEach((f) => dt.items.add(f));
  kbFilesInputEl.files = dt.files;
}

function renderKbFiles() {
  if (!kbFilesListEl) return;
  kbFilesListEl.innerHTML = "";

  kbSelectedFiles.forEach((file, idx) => {
    const row = document.createElement("div");
    row.className = "kb-file-item";

    const name = document.createElement("div");
    name.className = "kb-file-name";
    name.title = file.name;
    name.textContent = file.name;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "kb-file-remove";
    btn.textContent = t("msg_delete");
    btn.addEventListener("click", () => {
      kbSelectedFiles.splice(idx, 1);
      syncKbInputFiles();
      renderKbFiles();
    });

    row.appendChild(name);
    row.appendChild(btn);
    kbFilesListEl.appendChild(row);
  });
}

function notifyMaxFiles() {
  alert(t("alert_max_files"));
}

function notifyOversize(names) {
  alert(`${t("alert_files_too_big")}\n- ${names.join("\n- ")}`);
}

function notifyDuplicates(names) {
  alert(`${t("alert_duplicate_files")}\n- ${names.join("\n- ")}`);
}

function validateAndInitFromInput() {
  const initial = Array.from(kbFilesInputEl?.files || []);
  const oversize = initial.filter((f) => f.size > KB_MAX_SIZE_BYTES).map((f) => f.name);
  const valid = initial.filter((f) => f.size <= KB_MAX_SIZE_BYTES);

  if (oversize.length) notifyOversize(oversize);

  kbSelectedFiles = valid.slice(0, KB_MAX_FILES);
  if (valid.length > KB_MAX_FILES) notifyMaxFiles();

  syncKbInputFiles();
  renderKbFiles();
}

if (kbFilesInputEl) {
  kbFilesInputEl.addEventListener("change", () => {
    const newlyPicked = Array.from(kbFilesInputEl.files || []);

    const map = new Map(kbSelectedFiles.map((f) => [kbFilesKey(f), f]));

    const duplicateNames = [];
    const oversizeNames = [];
    let maxReached = false;

    for (const f of newlyPicked) {
      if (f.size > KB_MAX_SIZE_BYTES) {
        oversizeNames.push(f.name);
        continue;
      }

      const key = kbFilesKey(f);
      if (map.has(key)) {
        duplicateNames.push(f.name);
        continue;
      }

      if (map.size >= KB_MAX_FILES) {
        maxReached = true;
        continue;
      }

      map.set(key, f);
    }

    kbSelectedFiles = Array.from(map.values());

    // Notifications (one per type)
    if (maxReached) notifyMaxFiles();
    if (oversizeNames.length) notifyOversize(oversizeNames);
    if (duplicateNames.length) notifyDuplicates(duplicateNames);

    syncKbInputFiles();
    renderKbFiles();
  });
}

// Initial render (in case browser restores input state)
try {
  validateAndInitFromInput();
} catch (_) {}
function setDraftResultLoading(message) {
  const el = document.getElementById("result");
  el.classList.add("is-loading");
  el.replaceChildren(); // очищаем безопасно

  const wrap = document.createElement("div");
  wrap.className = "result-loading";

  const spinner = document.createElement("span");
  spinner.className = "result-spinner";
  spinner.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.textContent = message;

  wrap.appendChild(spinner);
  wrap.appendChild(text);
  el.appendChild(wrap);
}

function setDraftResultText(text) {
  const el = document.getElementById("result");
  el.classList.remove("is-loading");
  el.textContent = text;
}

function setDraftResultMarkdown(markdown) {
  const el = document.getElementById("result");
  el.classList.remove("is-loading");

  if (typeof marked !== "undefined") {
    el.innerHTML = marked.parse(markdown);
  } else {
    el.textContent = markdown;
  }
}


document.getElementById("generateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const feature = document.getElementById("feature").value;
  const extraInfo = document.getElementById("extraInfo").value;
  const enterpriseToggle = document.getElementById("analysisModeToggle");
  const mode = enterpriseToggle.checked ? "enterprise-lite" : "mvp";



  // Получаем ссылки из списка
  const kbLinksElements = document.querySelectorAll(".kb-link-chip a");
  const kbLinks = Array.from(kbLinksElements).map(el => el.href);

  const kbFilesInput = document.getElementById("kbFiles");
  const kbFiles = Array.from(kbFilesInput.files).map((f) => ({
    name: f.name,
    size: f.size,
    type: f.type,
  }));

  const payload = {
    feature,
    extraInfo,
    kbLinks,
    kbFiles,
    language: document.getElementById("language").value,
    mode,
    include: {
      acceptanceCriteria: document.getElementById("incAC").checked,
      testCases: document.getElementById("incTC").checked,
      negativeScenarios: document.getElementById("incNeg").checked,
      outOfScope: document.getElementById("incOOS").checked,
    },
    parentRequestId:
      (window.isRegeneration || window.isClarification) && window.lastRequestId
        ? window.lastRequestId
        : null,
  };

  // пока ждём — просто текст
  setDraftResultLoading(t("status_generating_long"));

  try {
    let res;
    if (kbSelectedFiles && kbSelectedFiles.length > 0) {
      const fd = new FormData();
      fd.append("feature", payload.feature || "");
      fd.append("extraInfo", payload.extraInfo || "");
      fd.append("language", payload.language || "RU");
      if (payload.mode) fd.append("mode", payload.mode);
      if (payload.parentRequestId) fd.append("parentRequestId", payload.parentRequestId);

      // Передаём массивы/объекты как JSON-строки (сервер ожидает строку и парсит)
      fd.append("kbLinks", JSON.stringify(payload.kbLinks || []));
      fd.append("include", JSON.stringify(payload.include || {}));

      // KB файлы: ключ должен быть ровно "kbFiles"
      kbSelectedFiles.forEach((f) => fd.append("kbFiles", f, f.name));

      res = await fetch("/api/generate", {
        method: "POST",
        body: fd,
      });
    } else {
      res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    // Получаем текст ответа для проверки формата
    const responseText = await res.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Response is not JSON:", responseText.substring(0, 200));
      
      let errorMessage = t("err_generic_title");
      let errorDetails = t("err_generic_details");
      
      // Пытаемся определить тип ошибки по тексту ответа
      const lowerText = responseText.toLowerCase();
      if (lowerText.includes("timeout") || lowerText.includes("timed out") || lowerText.includes("task timed")) {
        errorMessage = t("err_timeout_title");
        errorDetails = t("err_timeout_details");
      } else if (lowerText.includes("network") || lowerText.includes("connection")) {
        errorMessage = t("err_network_title");
        errorDetails = t("err_network_details");
      } else if (responseText.length > 0) {
        errorDetails = `Сервер вернул: ${responseText.substring(0, 100)}`;
      }
      
      setDraftResultText(`${errorMessage}\n\n${errorDetails}`);
      return;
    }

    if (!res.ok) {
      // Обработка ошибок от сервера
      let errorMessage = t("err_generic_title");
      let errorDetails = t("err_generic_details");
      
      if (data.error) {
        errorMessage = data.error;
      }
      
      if (data.details) {
        errorDetails = data.details;
      } else if (data.error && !data.details) {
        errorDetails = data.error;
      }
      
      // Специальная обработка ошибок Airtable
      if (data.airtable && data.airtable.error) {
        errorMessage = "Ошибка базы данных";
        
        // Правильно сериализуем ошибку Airtable
        if (typeof data.airtable.error === "string") {
          errorDetails = `Ошибка Airtable: ${data.airtable.error}`;
        } else if (data.airtable.error === "NOT_FOUND") {
          errorMessage = "Ошибка конфигурации";
          errorDetails = "База данных или таблица не найдены. Обратитесь к администратору системы.";
        } else if (data.airtable.error.type === "INVALID_VALUE_FOR_COLUMN") {
          errorDetails = `Ошибка Airtable: ${data.airtable.error.message || "Неверное значение для колонки"}`;
        } else {
          // Если это объект, сериализуем его в JSON
          errorDetails = `Ошибка Airtable: ${JSON.stringify(data.airtable.error)}`;
        }
      }
      
      setDraftResultText(`${errorMessage}\n\n${errorDetails}`);
      console.error("Server error:", data);
      return;
    }

    const markdown = data.result || "Ошибка: пустой ответ от сервера";

    // сохраняем сырой markdown для скачивания
    window.lastMarkdown = markdown;

    // рендерим markdown -> HTML (таблицы, <br> и т.д.)
    setDraftResultMarkdown(markdown);


    window.lastRequestId = data.requestId;
    window.isRegeneration = false;
    window.isClarification = false;

    document.getElementById("clarifyBtn").style.display = "inline-flex";
  } catch (err) {
    console.error("Fetch error:", err);
    
    let errorMessage = "Генерация не отработала";
    let errorDetails = "Произошла ошибка при отправке запроса";
    
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      errorMessage = "Ошибка сети";
      errorDetails = "Не удалось установить соединение с сервером. Проверьте подключение к интернету и попробуйте снова.";
    } else if (err.message) {
      errorDetails = err.message;
    }
    
    setDraftResultText(`${errorMessage}\n\n${errorDetails}`);
  }
});

// «Уточнить»
document.getElementById("clarifyBtn").addEventListener("click", () => {
  window.isClarification = true;
  document
    .getElementById("generateForm")
    .dispatchEvent(new Event("submit"));
});

// Функция валидации email
function isValidEmail(email) {
  if (!email || email.trim() === "") {
    return true; // Пустой email допустим (необязательное поле)
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Фидбек
const feedbackForm = document.getElementById("feedbackForm");
const feedbackMessage = document.getElementById("feedbackMessage");

// Запрещаем вставку/перетаскивание изображений в feedback textarea
function lockTextareaImages(textareaEl) {
  if (!textareaEl) return;

  textareaEl.addEventListener("paste", (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        feedbackMessage.textContent =
          t("fb_insert_image_not_supported");
        feedbackMessage.style.display = "block";
        feedbackMessage.style.background = "#fef2f2";
        feedbackMessage.style.borderColor = "#ef4444";
        feedbackMessage.style.color = "#991b1b";
        setTimeout(() => {
          feedbackMessage.style.display = "none";
        }, 3000);
        return;
      }
    }
  });

  textareaEl.addEventListener("dragover", (e) => e.preventDefault());
  textareaEl.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type && files[i].type.startsWith("image/")) {
        feedbackMessage.textContent =
          t("fb_drag_image_not_supported");
        feedbackMessage.style.display = "block";
        feedbackMessage.style.background = "#fef2f2";
        feedbackMessage.style.borderColor = "#ef4444";
        feedbackMessage.style.color = "#991b1b";
        setTimeout(() => {
          feedbackMessage.style.display = "none";
        }, 3000);
        return;
      }
    }
  });
}

["wouldUseWhy", "manualWork", "extra", "whereManual", "wontPayFor"].forEach((id) => {
  lockTextareaImages(document.getElementById(id));
});

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rating = document.getElementById("rating").value;
  const email = document.getElementById("email").value.trim();
  const requestId = window.lastRequestId || null;

  const wouldUse = document.getElementById("wouldUse")?.value || "";
  const wouldUseWhy = document.getElementById("wouldUseWhy")?.value?.trim() || "";
  const manualWork = document.getElementById("manualWork")?.value?.trim() || "";
  const extra = document.getElementById("extra")?.value?.trim() || "";
  const whereManual = document.getElementById("whereManual")?.value?.trim() || "";
  const wontPayFor = document.getElementById("wontPayFor")?.value?.trim() || "";
  const wouldBeUpset = document.getElementById("wouldBeUpset")?.value || "";

  // Валидация рейтинга
  if (!rating || rating === "") {
    feedbackMessage.textContent = t("fb_select_rating");
    feedbackMessage.style.display = "block";
    feedbackMessage.style.background = "#fef2f2";
    feedbackMessage.style.borderColor = "#ef4444";
    feedbackMessage.style.color = "#991b1b";
    return;
  }

  // Валидация email
  if (!isValidEmail(email)) {
    feedbackMessage.textContent = t("fb_invalid_email");
    feedbackMessage.style.display = "block";
    feedbackMessage.style.background = "#fef2f2";
    feedbackMessage.style.borderColor = "#ef4444";
    feedbackMessage.style.color = "#991b1b";
    return;
  }

  // Показываем индикатор загрузки
  const submitButton = feedbackForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = t("fb_sending");

  try {
    const payload = {
      rating: Number(rating),
      email: email || null,
      requestId: requestId,
      wouldUse,
      wouldUseWhy,
      manualWork,
      extra,
      whereManual,
      wontPayFor,
      wouldBeUpset,
    };

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Ошибка при отправке фидбека");
    }

    // Успешная отправка
    feedbackMessage.textContent = t("fb_success");
    feedbackMessage.style.display = "block";
    feedbackMessage.style.background = "#f0fdf4";
    feedbackMessage.style.borderColor = "#22c55e";
    feedbackMessage.style.color = "#166534";

    // Очищаем форму
    feedbackForm.reset();

    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
      feedbackMessage.style.display = "none";
    }, 5000);
  } catch (err) {
    feedbackMessage.textContent = `${t("fb_error_prefix")} ${err.message}. ${t("fb_try_again")}`;
    feedbackMessage.style.display = "block";
    feedbackMessage.style.background = "#fef2f2";
    feedbackMessage.style.borderColor = "#ef4444";
    feedbackMessage.style.color = "#991b1b";
    console.error("Feedback error:", err);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

// Сохранение результата в файл
document.getElementById("downloadBtn").addEventListener("click", () => {
  const resultText = (window.lastMarkdown || "").trim();

  if (!resultText || resultText.startsWith("Пока пусто")) {
    alert("Нет результата для сохранения.");
    return;
  }

  const format = document.getElementById("fileFormat").value; // md | txt | word | pdf | xlsx
  const rawTitle = document.getElementById("feature").value.trim();

  let baseName = rawTitle || "requirements";
  baseName = baseName.split("\n")[0].trim();
  if (baseName.length > 60) {
    baseName = baseName.slice(0, 60);
  }

  baseName =
    baseName
      .toLowerCase()
      .replace(/["'`]/g, "")
      .replace(/[^\p{L}\p{N}\-_ ]/gu, " ")
      .replace(/\s+/g, "_")
      .trim() || "requirements";

  let ext = format;
  let mime = "text/plain;charset=utf-8";

  if (format === "word" || format === "pdf" || format === "xlsx") {
    ext = "txt";
    alert(
      "В текущем MVP форматы Word/PDF/Excel сохраняются как текстовый файл (.txt)."
    );
  }

  const filename = `${baseName}.${ext}`;

  const blob = new Blob([resultText], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Collapse / Expand базы знаний
const kbToggleBtn = document.getElementById("kbToggle");
const kbContent = document.getElementById("kbContent");

if (kbToggleBtn && kbContent) {
  let kbCollapsed = false;

  const updateKbToggleText = () => {
    kbToggleBtn.textContent = kbCollapsed ? t("kb_expand") : t("kb_collapse");
  };

  kbToggleBtn.addEventListener("click", () => {
    kbCollapsed = !kbCollapsed;
    kbContent.classList.toggle("kb-collapsed", kbCollapsed);
    updateKbToggleText();
  });

  document.querySelector(".kb-header").addEventListener("click", (e) => {
    if (e.target === kbToggleBtn) return;
    if (e.target.closest && e.target.closest(".tooltip")) return;
kbCollapsed = !kbCollapsed;
    kbContent.classList.toggle("kb-collapsed", kbCollapsed);
    updateKbToggleText();
  });

  updateKbToggleText();
}

// Управление ссылками базы знаний
const kbLinksInput = document.getElementById("kbLinksInput");
const kbLinksList = document.getElementById("kbLinksList");
const storedLinks = new Set();

// Функция для валидации URL
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Функция для нормализации URL (добавляет https:// если нет протокола)
const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // Если уже валидный URL, вернуть как есть
  if (isValidUrl(trimmed)) {
    return trimmed;
  }
  
  // Попробовать добавить https://
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    const withProtocol = `https://${trimmed}`;
    if (isValidUrl(withProtocol)) {
      return withProtocol;
    }
  }
  
  return null;
};

// Функция для добавления ссылки
const addLink = (urlString) => {
  const normalizedUrl = normalizeUrl(urlString);
  if (!normalizedUrl || storedLinks.has(normalizedUrl)) {
    return false;
  }
  
  storedLinks.add(normalizedUrl);
  renderLinks();
  return true;
};

// Функция для удаления ссылки
const removeLink = (url) => {
  storedLinks.delete(url);
  renderLinks();
};

// Функция для отрисовки всех ссылок
const renderLinks = () => {
  kbLinksList.innerHTML = "";
  
  storedLinks.forEach((url) => {
    const chip = document.createElement("div");
    chip.className = "kb-link-chip";
    
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = url;
    link.addEventListener("click", (e) => {
      // Открывать только с Ctrl+Click (или Cmd+Click на Mac)
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
      }
      // При Ctrl+Click разрешаем стандартное поведение (открытие в новой вкладке)
    });
    
    const removeBtn = document.createElement("span");
    removeBtn.className = "remove";
    removeBtn.textContent = "×";
    removeBtn.setAttribute("aria-label", t("msg_delete"));
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeLink(url);
    });
    
    chip.appendChild(link);
    chip.appendChild(removeBtn);
    kbLinksList.appendChild(chip);
  });
};

// Обработка ввода ссылок
if (kbLinksInput) {
  kbLinksInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = kbLinksInput.value.trim();
      if (value) {
        // Если запятая - разделить на несколько ссылок
        if (e.key === ",") {
          const links = value.split(",").map(l => l.trim()).filter(l => l);
          links.forEach(link => {
            const normalized = normalizeUrl(link);
            if (normalized) {
              addLink(normalized);
            }
          });
        } else {
          // Enter - добавить как одну ссылку
          addLink(value);
        }
        kbLinksInput.value = "";
      }
    }
  });
  
  // Обработка вставки из буфера обмена (может содержать несколько ссылок через запятую или перенос строки)
  kbLinksInput.addEventListener("paste", (e) => {
    setTimeout(() => {
      const value = kbLinksInput.value.trim();
      if (value) {
        // Разделить по запятой, пробелу или переносу строки
        const links = value.split(/[,\s\n]+/).map(l => l.trim()).filter(l => l);
        links.forEach(link => {
          const normalized = normalizeUrl(link);
          if (normalized) {
            addLink(normalized);
          }
        });
        kbLinksInput.value = "";
      }
    }, 0);
  });
}


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
    btn.textContent = "Удалить";
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
  alert("Можно добавить максимум 3 файла базы знаний.");
}

function notifyOversize(names) {
  alert(`Файл(ы) превышают 5 MB и не будут добавлены:\n- ${names.join("\n- ")}`);
}

function notifyDuplicates(names) {
  alert(`Файл уже загружен и не будет добавлен повторно:\n- ${names.join("\n- ")}`);
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
      questions: document.getElementById("incQuestions").checked,
      acceptanceCriteria: document.getElementById("incAC").checked,
      testCases: document.getElementById("incTC").checked,
      negativeScenarios: document.getElementById("incNeg").checked,
      outOfScope: document.getElementById("incOOS").checked,
      useKnowledgeBase: document.getElementById("useKB").checked,
    },
    parentRequestId:
      (window.isRegeneration || window.isClarification) && window.lastRequestId
        ? window.lastRequestId
        : null,
  };

  // пока ждём — просто текст
  document.getElementById("result").innerText = "Генерация...";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Получаем текст ответа для проверки формата
    const responseText = await res.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Response is not JSON:", responseText.substring(0, 200));
      
      let errorMessage = "Генерация не отработала";
      let errorDetails = "Сервер вернул ответ в неожиданном формате";
      
      // Пытаемся определить тип ошибки по тексту ответа
      const lowerText = responseText.toLowerCase();
      if (lowerText.includes("timeout") || lowerText.includes("timed out") || lowerText.includes("task timed")) {
        errorMessage = "Превышено время ожидания";
        errorDetails = "Генерация требований заняла слишком много времени и была прервана. Попробуйте упростить описание фичи или повторить попытку позже.";
      } else if (lowerText.includes("network") || lowerText.includes("connection")) {
        errorMessage = "Ошибка сети";
        errorDetails = "Не удалось установить соединение с сервером. Проверьте подключение к интернету и попробуйте снова.";
      } else if (responseText.length > 0) {
        errorDetails = `Сервер вернул: ${responseText.substring(0, 100)}`;
      }
      
      document.getElementById("result").innerText = `${errorMessage}\n\n${errorDetails}`;
      return;
    }

    if (!res.ok) {
      // Обработка ошибок от сервера
      let errorMessage = "Генерация не отработала";
      let errorDetails = "Произошла ошибка при генерации требований";
      
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
      
      document.getElementById("result").innerText = `${errorMessage}\n\n${errorDetails}`;
      console.error("Server error:", data);
      return;
    }

    const markdown = data.result || "Ошибка: пустой ответ от сервера";

    // сохраняем сырой markdown для скачивания
    window.lastMarkdown = markdown;

    // рендерим markdown -> HTML (таблицы, <br> и т.д.)
    if (typeof marked !== "undefined") {
      document.getElementById("result").innerHTML = marked.parse(markdown);
    } else {
      // fallback, если вдруг marked не загрузился
      document.getElementById("result").innerText = markdown;
    }

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
    
    document.getElementById("result").innerText = `${errorMessage}\n\n${errorDetails}`;
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

// Запрещаем вставку изображений в textarea
const commentField = document.getElementById("comment");
if (commentField) {
  commentField.addEventListener("paste", (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          feedbackMessage.textContent = "Вставка изображений не поддерживается. Пожалуйста, используйте только текст.";
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
    }
  });

  // Также запрещаем drag & drop изображений
  commentField.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  commentField.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("image/")) {
          feedbackMessage.textContent = "Перетаскивание изображений не поддерживается. Пожалуйста, используйте только текст.";
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
    }
  });
}

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();
  const email = document.getElementById("email").value.trim();
  const requestId = window.lastRequestId || null;

  // Валидация рейтинга
  if (!rating || rating === "") {
    feedbackMessage.textContent = "Пожалуйста, выберите оценку.";
    feedbackMessage.style.display = "block";
    feedbackMessage.style.background = "#fef2f2";
    feedbackMessage.style.borderColor = "#ef4444";
    feedbackMessage.style.color = "#991b1b";
    return;
  }

  // Валидация email
  if (!isValidEmail(email)) {
    feedbackMessage.textContent = "Пожалуйста, введите корректный email адрес или оставьте поле пустым.";
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
  submitButton.textContent = "Отправка...";

  try {
    const payload = {
      rating: Number(rating),
      comment: comment,
      email: email || null,
      requestId: requestId,
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
    feedbackMessage.textContent = "Спасибо! Ваш фидбек успешно отправлен.";
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
    feedbackMessage.textContent = `Ошибка: ${err.message}. Пожалуйста, попробуйте еще раз.`;
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
    kbToggleBtn.textContent = kbCollapsed ? "Показать" : "Свернуть";
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
    removeBtn.setAttribute("aria-label", "Удалить ссылку");
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

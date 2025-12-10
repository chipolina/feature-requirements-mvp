// Генерация
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

    const data = await res.json();

    if (!res.ok) {
      // Обработка ошибок от сервера
      let errorMessage = "Произошла ошибка при генерации.";
      
      if (data.error) {
        errorMessage = `Ошибка: ${data.error}`;
        
        // Специальная обработка ошибок Airtable
        if (data.airtable && data.airtable.error === "NOT_FOUND") {
          errorMessage = "Ошибка конфигурации Airtable: база данных или таблица не найдены. Проверьте переменные окружения AIRTABLE_BASE_ID и AIRTABLE_REQUESTS_TABLE.";
        } else if (data.airtable && data.airtable.error) {
          errorMessage = `Ошибка Airtable: ${data.airtable.error}`;
        }
      }
      
      document.getElementById("result").innerText = errorMessage;
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
    document.getElementById("result").innerText = `Ошибка сети: ${err.message}. Проверьте подключение к интернету и попробуйте снова.`;
  }
});

// «Уточнить»
document.getElementById("clarifyBtn").addEventListener("click", () => {
  window.isClarification = true;
  document
    .getElementById("generateForm")
    .dispatchEvent(new Event("submit"));
});

// Фидбек
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    rating: Number(document.getElementById("rating").value),
    comment: document.getElementById("comment").value,
    email: document.getElementById("email").value,
    requestId: window.lastRequestId || null,
  };

  await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  alert("Спасибо! Фидбек отправлен.");
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

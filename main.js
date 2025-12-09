// Генерация
document.getElementById("generateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const feature = document.getElementById("feature").value;
    const extraInfo = document.getElementById("extraInfo").value;

    const kbLinks = document.getElementById("kbLinks").value
        .split("\n")
        .map(x => x.trim())
        .filter(x => x !== "");

    const kbFilesInput = document.getElementById("kbFiles");
    const kbFiles = Array.from(kbFilesInput.files).map(f => ({
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

    document.getElementById("result").innerText = "Генерация...";

    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    document.getElementById("result").innerText = data.result || "Ошибка";

    window.lastRequestId = data.requestId;
    window.isRegeneration = false;
    window.isClarification = false;

    document.getElementById("clarifyBtn").style.display = "inline-flex";
    document.getElementById("regenerateBtn").style.display = "inline-flex";
});

// «Сгенерировать ещё раз»
document.getElementById("regenerateBtn").addEventListener("click", () => {
    window.isRegeneration = true;
    document.getElementById("generateForm").dispatchEvent(new Event("submit"));
});

// «Уточнить»
document.getElementById("clarifyBtn").addEventListener("click", () => {
    window.isClarification = true;
    document.getElementById("generateForm").dispatchEvent(new Event("submit"));
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
    const resultText = document.getElementById("result").innerText || "";
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

    baseName = baseName
        .toLowerCase()
        .replace(/["'`]/g, "")
        .replace(/[^\p{L}\p{N}\-_ ]/gu, " ")
        .replace(/\s+/g, "_")
        .trim() || "requirements";

    let ext = format;
    let mime = "text/plain;charset=utf-8";

    if (format === "word" || format === "pdf" || format === "xlsx") {
        // MVP-заглушка: сохраняем как обычный .txt,
        // но явно предупреждаем пользователя
        ext = "txt";
        alert("В текущем MVP форматы Word/PDF/Excel сохраняются как текстовый файл (.txt).");
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

    // также позволим кликать по заголовку целиком
    document.querySelector(".kb-header").addEventListener("click", (e) => {
        // не дублируем клик по самой кнопке
        if (e.target === kbToggleBtn) return;
        kbCollapsed = !kbCollapsed;
        kbContent.classList.toggle("kb-collapsed", kbCollapsed);
        updateKbToggleText();
    });

    updateKbToggleText();
}

// Генерация
document.getElementById("generateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const feature = document.getElementById("feature").value;
    const kbLinks = document.getElementById("kbLinks").value
        .split("\n")
        .map(x => x.trim())
        .filter(x => x !== "");

    const kbFilesInput = document.getElementById("kbFiles");
    const kbFiles = Array.from(kbFilesInput.files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
    }));

    const payload = {
        feature,
        kbLinks,
        kbFiles, // пока просто метаданные
        language: document.getElementById("language").value,
        include: {
            questions: document.getElementById("incQuestions").checked,
            acceptanceCriteria: document.getElementById("incAC").checked,
            testCases: document.getElementById("incTC").checked,
            negativeScenarios: document.getElementById("incNeg").checked,
            outOfScope: document.getElementById("incOOS").checked,
            useKnowledgeBase: document.getElementById("useKB").checked
        },
        // позже сюда можно добавлять parentRequestId
    };

    document.getElementById("result").innerText = "Генерация...";

    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    document.getElementById("result").innerText = data.result || "Ошибка";

    window.lastRequestId = data.requestId; // для фидбека и будущей повторной генерации
    document.getElementById("regenerateBtn").style.display = "block";
});

// «Сгенерировать ещё раз» — пока просто повторно отправляем форму
document.getElementById("regenerateBtn").addEventListener("click", () => {
    document.getElementById("generateForm").dispatchEvent(new Event("submit"));
});

// Фидбек
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        rating: Number(document.getElementById("rating").value),
        comment: document.getElementById("comment").value,
        email: document.getElementById("email").value,
        requestId: window.lastRequestId || null
    };

    await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    alert("Спасибо! Фидбек отправлен.");
});

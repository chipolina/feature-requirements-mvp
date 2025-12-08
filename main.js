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
        type: f.type,
    }));

    const payload = {
        feature,
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
        parentRequestId: window.isRegeneration ? window.lastRequestId : null,
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
    document.getElementById("regenerateBtn").style.display = "block";
});

// «Сгенерировать ещё раз»
document.getElementById("regenerateBtn").addEventListener("click", () => {
    window.isRegeneration = true;
    document.getElementById("generateForm").dispatchEvent(new Event("submit"));
});

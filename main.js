document.getElementById("generateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const feature = document.getElementById("feature").value;
    const kbLinks = document.getElementById("kbLinks").value.split("\n").filter(x => x.trim() !== "");
    const kbFiles = document.getElementById("kbFiles").files;

    const payload = {
        feature,
        kbLinks,
        language: document.getElementById("language").value,
        include: {
            questions: document.getElementById("incQuestions").checked,
            ac: document.getElementById("incAC").checked,
            tc: document.getElementById("incTC").checked,
            neg: document.getElementById("incNeg").checked,
            oos: document.getElementById("incOOS").checked,
            useKB: document.getElementById("useKB").checked
        }
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(payload));

    for (let f of kbFiles) {
        formData.append("files", f);
    }

    document.getElementById("result").innerText = "Генерация...";
    
    const res = await fetch("/api/generate", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    document.getElementById("result").innerText = data.result || "Ошибка";

    // показать кнопку повторной генерации
    window.lastRequestId = data.requestId;
    document.getElementById("regenerateBtn").style.display = "block";
});

document.getElementById("regenerateBtn").addEventListener("click", () => {
    document.getElementById("generateForm").dispatchEvent(new Event("submit"));
});

// Фидбек
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        rating: document.getElementById("rating").value,
        comment: document.getElementById("comment").value,
        email: document.getElementById("email").value,
        requestId: window.lastRequestId
    };

    const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    alert("Спасибо! Фидбек отправлен.");
});

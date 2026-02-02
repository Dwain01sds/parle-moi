const ntfyURL = "https://ntfy.sh/perso";

let selectedEmotion = "😞 Triste";

const comfortMessages = {
  "Problèmes": "Tu fais bien d’en parler. Je t’écoute vraiment.",
  "Juste parler": "Tu peux parler librement, sans attente.",
  "Conseil": "Je ferai de mon mieux pour t’aider.",
  "Rappelle-moi": "Je voulais juste que tu penses à moi plus tard."
};

// émotions
document.querySelectorAll(".emotion").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".emotion").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedEmotion = btn.dataset.emo;
  };
});

// onglets
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("comfortText").textContent =
      comfortMessages[btn.dataset.type];
  };
});

document.querySelectorAll(".sub-tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});

// envoi
document.getElementById("sendBtn").onclick = () => {
  const message = document.getElementById("message").value.trim();
  const name = document.getElementById("name").value.trim() || "Anonyme";
  const noReply = document.getElementById("noReply").checked ? "Oui" : "Non";

  if (!message) return;

  const type = document.querySelector(".tab-btn.active").dataset.type;
  const cat = document.querySelector(".sub-tab-btn.active").dataset.cat;

  const payload =
`🌙 Message pour Dwain

👤 De : ${name}
💗 Émotion : ${selectedEmotion}
📌 Type : ${type}
👥 Catégorie : ${cat}
💭 Réponse attendue : ${noReply === "Oui" ? "Non" : "Oui"}

💬 Message :
${message}`;

  // sauvegarde locale
  const history = JSON.parse(localStorage.getItem("cocoonMessages") || "[]");
  history.push({ name, selectedEmotion, type, cat, noReply, message });
  localStorage.setItem("cocoonMessages", JSON.stringify(history));

  // ntfy
  navigator.sendBeacon(
    ntfyURL,
    new Blob([payload], { type: "text/plain" })
  );

  if (navigator.vibrate) navigator.vibrate(30);

  document.getElementById("thankyou").textContent =
    "C’est bien arrivé 🤍 Prends soin de toi.";

  document.getElementById("message").value = "";
};

const ntfyURL = "https://ntfy.sh/perso";
let selectedEmotion = "😞 Triste";

const comfortMessages = {
  "Problèmes": "Tu fais bien d’en parler. Je t’écoute vraiment.",
  "Juste parler": "Tu peux parler librement, sans attente.",
  "Conseil": "Je ferai de mon mieux pour t’aider.",
  "Rappelle-moi": "Je voulais juste que tu penses à moi plus tard."
};

// --- ÉMOTIONS ---
document.querySelectorAll(".emotion").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".emotion").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedEmotion = btn.dataset.emo;
  };
});

// --- ONGLET ---
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

// --- APERÇU IMAGE ---
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const removeImageBtn = document.getElementById("removeImage");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    previewContainer.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

removeImageBtn.onclick = () => {
  fileInput.value = "";
  previewImage.src = "";
  previewContainer.classList.add("hidden");
};

// --- ENVOI ---
document.getElementById("sendBtn").onclick = async () => {
  const message = document.getElementById("message").value.trim();
  const name = document.getElementById("name").value.trim() || "Anonyme";
  const noReply = document.getElementById("noReply").checked;
  const file = fileInput.files[0];

  if (!message && !file) return;

  const type = document.querySelector(".tab-btn.active").dataset.type;
  const cat = document.querySelector(".sub-tab-btn.active").dataset.cat;

  const payload =
`🌙 Message pour Dwain

👤 De : ${name}
💗 Émotion : ${selectedEmotion}
📌 Type : ${type}
👥 Catégorie : ${cat}
💭 Réponse attendue : ${noReply ? "Non" : "Oui"}

💬 Message :
${message || "(message sans texte)"}`;

  // TEXTE
  navigator.sendBeacon(
    ntfyURL,
    new Blob([payload], { type: "text/plain" })
  );

  // FICHIER
  if (file) {
    await fetch(ntfyURL, {
      method: "POST",
      body: file,
      headers: {
        "Title": `📎 Fichier de ${name}`,
        "Filename": file.name
      }
    });
  }

  if (navigator.vibrate) navigator.vibrate(30);

  document.getElementById("thankyou").textContent =
    "C’est bien arrivé 🤍 Merci pour ta confiance.";

  document.getElementById("message").value = "";
  fileInput.value = "";
  previewContainer.classList.add("hidden");
};

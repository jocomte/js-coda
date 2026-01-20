// Variables d'état
let selectedSkin = null;
const FRAME_SIZE = 64; // Taille de chaque frame
const LINE_3_OFFSET = 128; // Décalage vertical de la 3e ligne (2 lignes * 64px)

// Liste explicite des fichiers présents dans le dossier assets
const availableSkins = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "10.png",
  "11.png",
  "12.png",
  "13.png",
  "14.png",
  "15.png",
  "16.png",
  "17.png",
  "18.png",
  "19.png",
  "20.png",
  "21.png",
  "22.png",
  "23.png",
  "24.png",
  "25.png",
  "26.png",
  "27.png",
  "28.png",
  "29.png",
];

// Éléments du DOM
const skinsContainer = document.getElementById("skins-container");
const pseudoInput = document.getElementById("pseudo");
const serverUrlInput = document.getElementById("serverUrl");
const joinBtn = document.getElementById("btn-join");
const errorMsg = document.getElementById("error-message");

/**
 * Initialisation : Génère les canvas pour chaque skin
 */
function initPortal() {
  skinsContainer.innerHTML = ""; // Vide le conteneur

  availableSkins.forEach((skinFile) => {
    // Créer un canvas pour afficher le skin
    const canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 60;
    canvas.classList.add("skin-option");
    canvas.dataset.skin = skinFile;

    // Charger l'image et la dessiner sur le canvas
    const img = new Image();
    img.src = `assets/${skinFile}`;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      // Dessiner la première frame de la 3e ligne
      ctx.drawImage(
        img,
        0,
        LINE_3_OFFSET, // Position source (x, y)
        FRAME_SIZE,
        FRAME_SIZE, // Taille source
        0,
        0, // Position destination
        60,
        60, // Taille destination (plus petit pour display)
      );
    };

    // Ajout de l'événement de clic
    canvas.addEventListener("click", () => selectSkin(canvas, skinFile));
    skinsContainer.appendChild(canvas);
  });
}

/**
 * Gère la sélection visuelle et logique d'un skin
 */
function selectSkin(canvasElement, skinName) {
  // Retirer la classe 'selected' de tous les skins
  const allSkins = document.querySelectorAll(".skin-option");
  allSkins.forEach((s) => s.classList.remove("selected"));

  // Ajouter la classe 'selected' au canvas cliqué
  canvasElement.classList.add("selected");

  // Mettre à jour la variable d'état
  selectedSkin = skinName;

  // Cacher le message d'erreur
  errorMsg.classList.add("hidden");
}

/**
 * Validation et Sauvegarde avant de rejoindre
 */
joinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const pseudo = pseudoInput.value.trim();
  const serverUrl = serverUrlInput.value.trim();
  const skinPath = selectedSkin ? `assets/${selectedSkin}` : null;

  // Validation des champs
  let errorMessages = [];

  if (!pseudo) {
    errorMessages.push("Le pseudo est requis");
  } else if (pseudo.length < 3) {
    errorMessages.push("Le pseudo doit contenir au moins 3 caractères");
  }

  if (!serverUrl) {
    errorMessages.push("L'URL du serveur est requise");
  } else if (!isValidUrl(serverUrl)) {
    errorMessages.push("L'URL du serveur n'est pas valide");
  }

  if (!selectedSkin) {
    errorMessages.push("Veuillez choisir un héros");
  }

  // Afficher les erreurs ou continuer
  if (errorMessages.length > 0) {
    errorMsg.textContent = errorMessages.join(" • ");
    errorMsg.classList.remove("hidden");
    return;
  }

  // Sauvegarde dans le localStorage
  const playerData = {
    name: pseudo,
    serverUrl: serverUrl,
    spritePath: skinPath,
  };
  localStorage.setItem("jsArenaPlayer", JSON.stringify(playerData));
  localStorage.setItem("name", pseudo);
  localStorage.setItem("serverUrl", serverUrl);
  localStorage.setItem("spritePath", skinPath);

  console.log("Connexion validée :", playerData);
  alert(`Bienvenue dans l'arène, ${pseudo} !`);
  window.location.href = "./game.html";
});

/**
 * Valide une URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Lancer l'initialisation au chargement de la page
window.addEventListener("DOMContentLoaded", initPortal);

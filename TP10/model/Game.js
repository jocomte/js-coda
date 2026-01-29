import Player from "./Player.js";
export default class Game {
  constructor() {
    // État du jeu
    this.isRunning = false;
    this.isOver = false;

    // Timer du jeu
    this.timer = 0;

    // Dictionnaire des joueurs
    this.players = {};
  }

  /**
   * @param {Object} gameStateFromServer - Les données renvoyées par le serveur
   */
  // ... (début du fichier inchangé)

  update(gameStateFromServer) {
    this.isRunning = gameStateFromServer.isRunning;
    this.isOver = gameStateFromServer.isOver;
    this.timer = gameStateFromServer.timer;

    // 1. Ajout et Mise à jour
    for (let playerId in gameStateFromServer.players) {
      let backendPlayer = gameStateFromServer.players[playerId];

      if (!this.players[playerId]) {
        console.log(
          "Création joueur:",
          playerId,
          "skin:",
          backendPlayer.skinPath,
        );
        this.players[playerId] = new Player(
          playerId,
          backendPlayer.name,
          backendPlayer.skinPath,
          { x: backendPlayer.position[0], y: backendPlayer.position[1] },
        );
      }
      // Update
      this.players[playerId].update(backendPlayer);
    }

    // 2. Suppression des joueurs déconnectés
    for (let frontPlayerId in this.players) {
      if (!(frontPlayerId in gameStateFromServer.players)) {
        console.log(
          "Suppression joueur:",
          frontPlayerId,
          "ancien skin:",
          this.players[frontPlayerId].skinPath,
        );
        // --- MODIFICATION ICI ---
        // Si la classe Player a une méthode pour nettoyer ses graphismes, on l'appelle
        if (this.players[frontPlayerId].destroy) {
          this.players[frontPlayerId].destroy();
        }
        // ------------------------

        delete this.players[frontPlayerId];
      }
    }

    console.log("Joueurs actuels:", Object.keys(this.players));
  }

  // ... (reste du fichier inchangé)
  getElapsedTime() {
    const seconds = Math.floor(this.timer);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }

  getAlivePlayersCount() {
    let alive = 0;
    let total = 0;

    for (let id in this.players) {
      total++;
      if (!this.players[id].isDying && this.players[id].hp > 0) {
        alive++;
      }
    }

    return { alive, total };
  }
}

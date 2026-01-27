class Game {
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
  update(gameStateFromServer) {
    this.isRunning = gameStateFromServer.isRunning;
    this.isOver = gameStateFromServer.isOver;
    this.timer = gameStateFromServer.timer;

    // 1. Ajout et Mise à jour
    for (let playerId in gameStateFromServer.players) {
      let backendPlayer = gameStateFromServer.players[playerId];

      if (!this.players[playerId]) {
        // Création : On garde la transformation en objet {x,y} du fichier pour la sécurité
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

    // 2. Suppression (Séparée, comme dans le prompt)
    for (let frontPlayerId in this.players) {
      if (!(frontPlayerId in gameStateFromServer.players)) {
        delete this.players[frontPlayerId];
      }
    }
  }
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

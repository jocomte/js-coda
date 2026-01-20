// Exemple de message recu par le backend, à utiliser pour vos tests :
const backendData = {
  isRunning: true,
  isOver: false,
  timer: 190.6000000000091,
  players: {
    "3cd71bbb-6a6b-4d4e-80e3-107130328a27": {
      name: "blabla",
      skinPath: "./spritesheets/3.png",
      position: [0.5600000000000003, 0.17999999999999977],
      lvl: 1,
      hp: 100,
      maxHp: 100,
      hpRegenRate: 10,
      speed: 0.2,
      direction: 3,
      isAttacking: false,
      isWalking: false,
      isDying: false,
      attackCooldown: 1,
      currentAttackCooldown: 0,
    },
    "28ead291-fcea-4b41-a596-d3c876c49a53": {
      name: "bloublou",
      skinPath: "./spritesheets/4.png",
      position: [0.44, 0.19],
      lvl: 1,
      hp: 100,
      maxHp: 100,
      hpRegenRate: 10,
      speed: 0.2,
      direction: 0,
      isAttacking: false,
      isWalking: false,
      isDying: false,
      attackCooldown: 1,
      currentAttackCooldown: 0,
    },
  },
};

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
    // Mise à jour des métadonnées
    this.isRunning = gameStateFromServer.isRunning;
    this.isOver = gameStateFromServer.isOver;
    this.timer = gameStateFromServer.timer;

    // Récupérer les IDs des joueurs du serveur
    const serverPlayerIds = Object.keys(gameStateFromServer.players);

    // Suppression des joueurs qui n'existent plus sur le serveur
    const frontPlayerIds = Object.keys(this.players);
    for (const playerId of frontPlayerIds) {
      if (!serverPlayerIds.includes(playerId)) {
        delete this.players[playerId];
      }
    }

    // Ajout ou mise à jour des joueurs
    for (const playerId of serverPlayerIds) {
      const serverPlayerData = gameStateFromServer.players[playerId];

      if (!this.players[playerId]) {
        // Créer une nouvelle instance Player
        this.players[playerId] = new Player(
          playerId,
          serverPlayerData.name,
          serverPlayerData.skinPath,
          { x: serverPlayerData.position[0], y: serverPlayerData.position[1] },
        );
      }

      // Mettre à jour les données du joueur
      if (this.players[playerId].update) {
        this.players[playerId].update(serverPlayerData);
      }
    }
  }
}

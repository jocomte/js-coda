export default class GameController {
  constructor(game, gameView) {
    // Server sends updates at 20 ticks per second
    this.SERVER_TICK_RATE = 20;
    // Duration between two server ticks in milliseconds
    this.SERVER_INTERVAL = 1000 / this.SERVER_TICK_RATE;

    // === Partie 1 : Initialisation des attributs ===

    // Instance de la classe Game pour stocker les informations de la partie et des joueurs
    this.game = game;

    // Instance de GameView pour gérer l'affichage
    this.gameView = gameView;

    // Récupération des données stockées dans le localStorage
    this.name = localStorage.getItem("name");
    this.serverUrl = localStorage.getItem("serverUrl");
    this.spritePath = localStorage.getItem("spritePath");

    // État des touches clavier (contrôles du joueur)
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      attack: false,
    };

    // === Partie 2 : Connexion au backend ===
    this.socket = new WebSocket(this.serverUrl);
    this.initSocket();

    // === Partie 5 : Gestion des événements clavier ===
    this.initInput();

    // === Partie 6 : Envoi de messages au backend ===
    this.startInputSender();

    // Manette
    this.gamepads = navigator.getGamepads();
    for (let i = 0; i < this.gamepads.length; i++) {
      const gamepad = this.gamepads[i];
      if (gamepad) {
        this.gamepad = gamepad;
        break;
      }
    }

    // Bind et démarrage de la boucle
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  // === Partie 2 : Initialisation de la connexion WebSocket ===
  initSocket() {
    this.socket.onopen = () => {
      console.log("Connecté au backend");
      const identificationMessage = {
        type: "register",
        name: this.name,
        skinPath: this.spritePath,
      };
      this.socket.send(JSON.stringify(identificationMessage));
      console.log("Message d'identification envoyé:", identificationMessage);
    };

    // === CORRECTION MAJEURE ICI ===
    this.socket.onmessage = (event) => {
      // 1. On reçoit les données
      const backendData = JSON.parse(event.data);

      // 2. On délègue TOUT le travail à Game.js
      // C'est Game.js qui sait comment ajouter, mettre à jour ET SUPPRIMER les joueurs
      this.game.update(backendData);
    };
  }

  // === Partie 5 : Gestion des événements clavier ===
  initInput() {
    document.addEventListener("keydown", (event) => {
      switch (event.key.toLowerCase()) {
        case "arrowup":
        case "z":
          this.inputState.up = true;
          break;
        case "arrowdown":
        case "s":
          this.inputState.down = true;
          break;
        case "arrowleft":
        case "q":
          this.inputState.left = true;
          break;
        case "arrowright":
        case "d":
          this.inputState.right = true;
          break;
        case " ":
          this.inputState.attack = true;
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key.toLowerCase()) {
        case "arrowup":
        case "z":
          this.inputState.up = false;
          break;
        case "arrowdown":
        case "s":
          this.inputState.down = false;
          break;
        case "arrowleft":
        case "q":
          this.inputState.left = false;
          break;
        case "arrowright":
        case "d":
          this.inputState.right = false;
          break;
        case " ":
          this.inputState.attack = false;
          break;
      }
    });

    window.addEventListener("gamepadconnected", (e) =>
      console.log("Manette connectée:", e.gamepad.id),
    );
    window.addEventListener("gamepaddisconnected", (e) =>
      console.log("Manette déconnectée:", e.gamepad.id),
    );
  }

  // === Partie 6 : Envoi de messages au backend ===
  startInputSender() {
    setInterval(() => {
      if (this.socket.readyState !== WebSocket.OPEN) return;
      const inputMessage = { type: "input", input: this.inputState };
      this.socket.send(JSON.stringify(inputMessage));
    }, this.SERVER_INTERVAL);
  }

  // === Partie 7 : Boucle de rendu ===
  loop(timestamp) {
    this.updateGamepadInput();
    this.gameView.render();
    requestAnimationFrame(this.loop);
  }

  // === Gestion de la manette ===
  updateGamepadInput() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) continue;

      const leftStickX = gamepad.axes[0];
      const leftStickY = gamepad.axes[1];
      const deadzone = 0.5;

      this.inputState.left = leftStickX < -deadzone;
      this.inputState.right = leftStickX > deadzone;
      this.inputState.up = leftStickY < -deadzone;
      this.inputState.down = leftStickY > deadzone;
      this.inputState.attack = gamepad.buttons[0].pressed; // Bouton A
      break;
    }
  }
}

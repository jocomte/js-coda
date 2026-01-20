class GameController {
  constructor() {
    // Server sends updates at 20 ticks per second
    this.SERVER_TICK_RATE = 20;
    // Duration between two server ticks in milliseconds
    this.SERVER_INTERVAL = 1000 / this.SERVER_TICK_RATE;

    // === Partie 1 : Initialisation des attributs ===

    // Instance de la classe Game pour stocker les informations de la partie et des joueurs
    this.game = new Game();

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

    // Instance de WebSocket pour communiquer avec le backend
    this.socket = new WebSocket(this.serverUrl);

    // Initialisation de la connexion WebSocket
    this.initSocket();

    // === Partie 5 : Gestion des événements clavier ===
    this.initInput();

    // === Partie 6 : Envoi de messages au backend ===
    this.startInputSender();

    // Permanently bind "this" at the instance of the GameController class
    this.loop = this.loop.bind(this);

    // Regulates framerate to keep 60fps
    requestAnimationFrame(this.loop);
  }

  // === Partie 2 : Initialisation de la connexion WebSocket ===
  initSocket() {
    // === Partie 3 : Envoi du premier message au backend ===

    // Callback déclenché à l'ouverture réussie de la connexion WebSocket
    this.socket.onopen = () => {
      console.log("Connecté au backend");

      // Message d'identification à envoyer au backend
      const identificationMessage = {
        type: "register",
        name: this.name,
        skinPath: this.spritePath,
      };

      // Envoi du message au backend au format JSON
      this.socket.send(JSON.stringify(identificationMessage));
      console.log("Message d'identification envoyé:", identificationMessage);
    };

    // === Partie 4 : Réception de messages envoyés par le backend ===

    // Callback déclenché à chaque réception d'un message du backend
    this.socket.onmessage = (event) => {
      // Transformation de la chaîne JSON reçue en objet JS
      const backendData = JSON.parse(event.data);
      console.log("Message reçu du backend:", backendData);

      // Mise à jour des données stockées dans le modèle Game
      // Mise à jour de l'état du jeu
      this.game.isRunning = backendData.isRunning;
      this.game.isOver = backendData.isOver;
      this.game.timer = backendData.timer;

      // Mise à jour des joueurs
      this.game.players = backendData.players;

      console.log("Modèle Game mis à jour:", this.game);
    };
  }

  // === Partie 5 : Gestion des événements clavier ===
  initInput() {
    // === Gestion du clavier ===

    // Gestion des pressions de touches (keydown)
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
      console.log(this.inputState);
    });

    // Gestion des relâchements de touches (keyup)
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
      console.log(this.inputState);
    });

    // === Gestion de la manette (Gamepad API) ===

    // Détection de la connexion d'une manette
    window.addEventListener("gamepadconnected", (event) => {
      console.log("Manette connectée:", event.gamepad.id);
    });

    // Détection de la déconnexion d'une manette
    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("Manette déconnectée:", event.gamepad.id);
    });
  }

  // === Partie 6 : Envoi de messages au backend ===
  startInputSender() {
    // Envoyer l'état des touches au backend toutes les SERVER_INTERVAL millisecondes
    setInterval(() => {
      // Vérifier que la connexion WebSocket est bien ouverte
      if (this.socket.readyState !== WebSocket.OPEN) {
        return;
      }

      // Créer le message à envoyer
      const inputMessage = {
        type: "input",
        input: this.inputState,
      };

      // Envoyer le message au backend au format JSON
      this.socket.send(JSON.stringify(inputMessage));
      console.log("État des entrées envoyé:", inputMessage);
    }, this.SERVER_INTERVAL);
  }

  // === Partie 7 : Boucle de rendu ===
  loop(timestamp) {
    // Mise à jour des entrées de la manette
    this.updateGamepadInput();

    // Affichage des informations de l'état du jeu
    console.group("État du jeu");
    console.log("Chronomètre:", this.game.timer);
    console.log("Jeu en cours:", this.game.isRunning);
    console.log("Jeu terminé:", this.game.isOver);
    console.log("Joueurs:", this.game.players);
    console.groupEnd();

    // Request the next frame
    requestAnimationFrame(this.loop);
  }

  // === Gestion de la manette ===
  updateGamepadInput() {
    // Récupérer la liste des manettes
    const gamepads = navigator.getGamepads();

    // Chercher la première manette connectée
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) continue;

      console.log(`Manette ${i} détectée:`, gamepad.id);

      // Récupérer les axes (analog sticks)
      const leftStickX = gamepad.axes[0];
      const leftStickY = gamepad.axes[1];
      const deadzone = 0.5; // Zone morte pour le stick analogique

      console.log(
        `Stick analogique - X: ${leftStickX.toFixed(2)}, Y: ${leftStickY.toFixed(2)}`,
      );

      // Gestion du stick analogique gauche pour le déplacement
      if (leftStickX < -deadzone) {
        this.inputState.left = true;
        console.log("← GAUCHE pressé");
      } else if (leftStickX > deadzone) {
        this.inputState.right = true;
        console.log("→ DROITE pressé");
      } else {
        this.inputState.left = false;
        this.inputState.right = false;
      }

      if (leftStickY < -deadzone) {
        this.inputState.up = true;
        console.log("↑ HAUT pressé");
      } else if (leftStickY > deadzone) {
        this.inputState.down = true;
        console.log("↓ BAS pressé");
      } else {
        this.inputState.up = false;
        this.inputState.down = false;
      }

      // Gestion des boutons
      // Button 0 = A, Button 1 = B, Button 2 = X, Button 3 = Y
      console.log("Boutons:", {
        A: gamepad.buttons[0].pressed,
        B: gamepad.buttons[1].pressed,
        X: gamepad.buttons[2].pressed,
        Y: gamepad.buttons[3].pressed,
      });

      if (gamepad.buttons[0].pressed) {
        this.inputState.attack = true;
        console.log("⚔️ ATTAQUE pressée");
      } else {
        this.inputState.attack = false;
      }

      console.log("État inputState:", this.inputState);

      // Si une manette est trouvée, on arrête la boucle
      break;
    }
  }
}

// === Start the game controller by instantiating the GameController class ===
// This line will execute the constructor (e.g, launch the frontend)
new GameController();

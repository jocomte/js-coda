// === Partie 1 : Création de la classe GameView ===

class GameView {
  constructor(game) {
    // Stocker la référence vers l'instance de Game
    this.game = game;

    // Récupérer l'élément <canvas> de la page
    this.canvas = document.getElementById("game-canvas");

    if (!this.canvas) {
      console.error("Canvas avec l'ID 'game-canvas' non trouvé dans la page!");
      return;
    }

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");

    // Cache des sprites
    this.spriteCache = {};

    // Dimensions de base
    this.FRAME_SIZE = 64;

    // === CONFIGURATION DES TAILLES D'ATTAQUE ===
    // Liste des skins qui ont des attaques TRÈS GRANDES (192x192)
    // Ajoutez ici les noms de vos fichiers (ex: "4.png", "boss.png")
    this.LARGE_ATTACK_SKINS = [
      "1.png",
      "2.png",
      "3.png",
      "4.png",
      "5.png",
      "6.png",
      "8.png",
      "9.png",
      "10.png",
      "11.png",
      "12.png",
      "14.png",
      "15.png",
      "16.png",
      "17.png",
      "19.png",
      "20.png",
      "22.png",
      "23.png",
      "25.png",
      "27.png",
      "28.png",
    ];

    console.log("GameView initialisée");
  }

  // === Partie 2 : Nettoyage et fond du canvas ===

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawBackground() {
    this.ctx.fillStyle = "#2a2a2a";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = "#444444";
    this.ctx.lineWidth = 1;

    // Grille
    for (let x = 0; x < this.width; x += 64) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 64) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }
  drawAliveIndicator() {
    const { alive, total } = this.game.getAlivePlayersCount();

    this.ctx.font = "14px Arial";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    const text = `👥 ${alive} / ${total} joueurs en vie`;

    this.ctx.fillText(text, 12, 12);
  }

  render() {
    this.clear();
    this.drawBackground();

    if (this.game.players) {
      let playersList = Array.isArray(this.game.players)
        ? this.game.players
        : Object.values(this.game.players);

      for (const player of playersList) {
        this.drawPlayer(player);
      }
    }
    this.drawAliveIndicator();
  }

  // === Partie 3 : Affichage des joueurs ===

  drawPlayer(player) {
    if (!player.position) return;

    // 1. GESTION DU CACHE
    let sprite = this.spriteCache[player.skinPath];
    if (!sprite) {
      sprite = new Image();
      sprite.src = player.skinPath;
      this.spriteCache[player.skinPath] = sprite;
      return;
    }

    if (!sprite.complete || sprite.naturalWidth === 0) return;

    // Conversion position
    let canvasX, canvasY;
    if (Array.isArray(player.position)) {
      canvasX = player.position[0] * this.width;
      canvasY = player.position[1] * this.height;
    } else {
      canvasX = player.position.x * this.width;
      canvasY = player.position.y * this.height;
    }

    // Animation
    if (player.animate) player.animate();

    // --- LOGIQUE D'AFFICHAGE ---
    let frameX = 0;
    let frameY = 0;
    let sourceWidth = 64;
    let sourceHeight = 64;
    let destWidth = 64;
    let destHeight = 64;
    let drawX = canvasX;
    let drawY = canvasY;

    const direction = player.direction;
    const directionMap = { 0: 0, 1: 3, 2: 2, 3: 1 };

    if (direction !== undefined && directionMap[direction] !== undefined) {
      const mappedDir = directionMap[direction];

      // CAS 0 : MORT
      if (player.isDying) {
        frameY = 20 * this.FRAME_SIZE;
        if (player.DeathSpriteIndex !== undefined) {
          frameX = player.DeathSpriteIndex * this.FRAME_SIZE;
        }
      }
      // CAS 1 : ATTAQUE
      else if (
        player.isAttacking ||
        player.AttackSpriteIndex > 0 ||
        player.currentAttackFrame > 0
      ) {
        const skinName = player.skinPath.split("/").pop();
        const isLarge = this.LARGE_ATTACK_SKINS.includes(skinName);

        if (isLarge) {
          const size = 192;
          sourceWidth = size;
          sourceHeight = size;
          destWidth = size;
          destHeight = size;
          const attackRows = { 0: 54, 1: 63, 2: 60, 3: 57 };
          frameY = (attackRows[direction] || 60) * this.FRAME_SIZE;
          drawX = canvasX - 64;
          drawY = canvasY - 64;
          if (player.AttackSpriteIndex !== undefined)
            frameX = player.AttackSpriteIndex * size;
        } else {
          const size = 128;
          sourceWidth = size;
          sourceHeight = size;
          destWidth = size;
          destHeight = size;
          const attackRows = { 0: 54, 1: 60, 2: 58, 3: 56 };
          frameY = (attackRows[direction] || 58) * this.FRAME_SIZE;
          drawX = canvasX - 32;
          drawY = canvasY - 32;
          if (player.AttackSpriteIndex !== undefined)
            frameX = player.AttackSpriteIndex * size;
        }
      }
      // CAS 2 : MARCHE
      else if (player.isWalking) {
        frameY = (mappedDir + 8) * this.FRAME_SIZE;
        if (player.WalkSpriteIndex !== undefined) {
          frameX = player.WalkSpriteIndex * this.FRAME_SIZE;
        }
      }
      // CAS 3 : IDLE
      else {
        frameY = mappedDir * this.FRAME_SIZE;
      }
    }

    // 1. Dessiner le Sprite
    this.ctx.drawImage(
      sprite,
      frameX,
      frameY,
      sourceWidth,
      sourceHeight,
      drawX,
      drawY,
      destWidth,
      destHeight,
    );

    // 2. Interface UI (Vie, Cooldown, Niveau)
    if (!player.isDying && player.hp > 0) {
      const barWidth = 40;
      const hpHeight = 5;
      const cdHeight = 3;

      // Position des barres (centrées)
      const barX = canvasX + (64 - barWidth) / 2;
      const hpY = canvasY - 10;
      const cdY = hpY + hpHeight + 1;

      // --- Barre de Vie ---
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
      this.ctx.fillRect(barX, hpY, barWidth, hpHeight);

      const hpPercent = Math.max(0, player.hp / player.maxHp);
      this.ctx.fillStyle = "#00ff00";
      this.ctx.fillRect(barX, hpY, barWidth * hpPercent, hpHeight);

      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(barX, hpY, barWidth, hpHeight);

      // --- Barre de Cooldown ---
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(barX, cdY, barWidth, cdHeight);

      let cdRatio = 1;
      if (player.attackCooldown > 0) {
        const current = player.currentAttackCooldown || 0;
        cdRatio = 1 - current / player.attackCooldown;
      }
      cdRatio = Math.max(0, Math.min(1, cdRatio));

      this.ctx.fillStyle = "#00d2ff";
      this.ctx.fillRect(barX, cdY, barWidth * cdRatio, cdHeight);
      this.ctx.strokeRect(barX, cdY, barWidth, cdHeight);

      // --- 3. DESSIN DU NIVEAU (BADGE) ---
      // On dessine un petit cercle doré à gauche de la barre de vie
      const levelX = barX - 10; // Décalé à gauche de la barre
      const levelY = hpY + 4; // Centré verticalement par rapport aux barres

      // Fond du badge (Cercle sombre)
      this.ctx.beginPath();
      this.ctx.arc(levelX, levelY, 8, 0, Math.PI * 2);
      this.ctx.fillStyle = "#222";
      this.ctx.fill();

      // Bordure dorée
      this.ctx.strokeStyle = "#ffd700"; // Or
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // Texte du niveau
      this.ctx.fillStyle = "#ffd700";
      this.ctx.font = "bold 10px Arial"; // Police petite et grasse
      this.ctx.textAlign = "center"; // Centré horizontalement
      this.ctx.textBaseline = "middle"; // Centré verticalement
      this.ctx.fillText(player.lvl || 1, levelX, levelY + 1); // +1 pour ajustement visuel
    }

    // 4. Dessiner le Pseudo
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(player.name, canvasX + 32, canvasY + 80);

    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(this.game.getElapsedTime(), this.canvas.width / 2, 20);
  }
}

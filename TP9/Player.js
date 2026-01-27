class Player {
  constructor(
    id = 0,
    name = "Anonymous",
    skin = "default",
    position = { x: 0, y: 0 },
    health = 100,
    options = {},
  ) {
    this.id = id;
    this.name = name;
    this.skin = skin;

    // === NOUVEAU : Gestion des positions pour interpolation ===

    // 1. Position "Cible" (celle reçue du serveur, le futur immédiat)
    // On s'assure que c'est un objet {x,y} même si le serveur envoie un tableau
    this.position = Array.isArray(position)
      ? { x: position[0], y: position[1] }
      : position;

    // 2. Position Précédente (d'où l'on vient)
    this.prevPosition = { ...this.position };

    // 3. Position de Rendu (là où on dessine réellement, entre prev et current)
    this.renderPosition = { ...this.position };

    // =========================================================

    this.health = health;
    this.isWalking = false;
    this.isAttacking = false;
    this.isDying = false;
    this.isIdle = false;
    this.direction = "down";

    // ... (vos compteurs d'animation existants : WalkSpriteDuration, etc.) ...
    this.WalkSpriteDuration = 0;
    this.WalkSpriteIndex = 0;
    this.WalkSpriteNumber = 9;
    this.AttackSpriteDuration = 7;
    this.AttackSpriteIndex = 0;
    this.AttackSpriteNumber = 6;
    this.DeathSpriteDuration = 0;
    this.DeathSpriteIndex = 0;
    this.DeathSpriteNumber = 6;
    this.IdleSpriteDuration = 0;
    this.IdleSpriteIndex = 0;
    this.IdleSpriteNumber = 0;
    this.currentWalkFrame = 0;
    this.currentAttackFrame = 0;
    this.currentDeathFrame = 0;
    this.currentIdleFrame = 0;

    Object.assign(this, options);
  }

  /**
   * Appelé quand le serveur envoie de nouvelles données.
   * On sauvegarde l'ancienne position avant de mettre à jour la nouvelle.
   */
  update(serverData) {
    // 1. L'actuelle devient la précédente
    this.prevPosition = { ...this.position };

    // 2. La nouvelle devient l'actuelle (la cible)
    if (serverData.position) {
      this.position = Array.isArray(serverData.position)
        ? { x: serverData.position[0], y: serverData.position[1] }
        : serverData.position;
    }

    // Mise à jour des stats
    if (serverData.hp !== undefined) this.health = serverData.hp;
    if (serverData.maxHp !== undefined) this.maxHp = serverData.maxHp;
    if (serverData.speed !== undefined) this.speed = serverData.speed;
    if (serverData.direction !== undefined)
      this.direction = serverData.direction;
    if (serverData.lvl !== undefined) this.lvl = serverData.lvl;
    if (serverData.name !== undefined) this.name = serverData.name;
    if (serverData.skinPath !== undefined) this.skinPath = serverData.skinPath;

    // Mise à jour des booléens d'état
    if (serverData.isWalking !== undefined)
      this.isWalking = serverData.isWalking;
    if (serverData.isAttacking !== undefined)
      this.isAttacking = serverData.isAttacking;
    if (serverData.isDying !== undefined) this.isDying = serverData.isDying;

    // Autres propriétés
    Object.assign(this, serverData);
  }

  /**
   * Calcule la position visuelle fluide entre prevPosition et position
   * @param {number} alpha - Progression entre 0 (prev) et 1 (current)
   */
  interpolate(alpha) {
    // Protection contre les valeurs hors limites
    const t = Math.max(0, Math.min(1, alpha));

    // Formule LERP : start + (end - start) * t
    this.renderPosition.x =
      this.prevPosition.x + (this.position.x - this.prevPosition.x) * t;
    this.renderPosition.y =
      this.prevPosition.y + (this.position.y - this.prevPosition.y) * t;
  }

  animate() {
    // ... (VOTRE CODE D'ANIMATION EXISTANT INCHANGÉ) ...
    // Copiez-collez ici le contenu de votre méthode animate existante
    // (Gestion de isWalking, isAttacking, isDying...)
    if (this.isWalking) {
      this.WalkSpriteDuration++;
      const framesPerSprite = 10;
      this.WalkSpriteIndex =
        Math.floor(this.WalkSpriteDuration / framesPerSprite) %
        this.WalkSpriteNumber;
    } else {
      this.WalkSpriteDuration = 0;
      this.WalkSpriteIndex = 0;
    }

    // ... le reste de vos animations ...
    if (
      this.isAttacking ||
      this.currentAttackFrame > 0 ||
      this.AttackSpriteIndex > 0
    ) {
      this.currentAttackFrame++;
      if (this.currentAttackFrame >= this.AttackSpriteDuration) {
        this.currentAttackFrame = 0;
        this.AttackSpriteIndex++;
      }
      if (this.AttackSpriteIndex >= this.AttackSpriteNumber) {
        this.AttackSpriteIndex = 0;
      }
    } else {
      this.currentAttackFrame = 0;
      this.AttackSpriteIndex = 0;
    }

    if (this.isDying) {
      this.DeathSpriteDuration++;
      if (this.DeathSpriteDuration >= this.DeathSpriteNumber * 10) {
        this.DeathSpriteIndex = this.DeathSpriteNumber - 1;
      } else {
        this.DeathSpriteIndex =
          Math.floor(this.DeathSpriteDuration / 10) % this.DeathSpriteNumber;
      }
    } else {
      this.DeathSpriteDuration = 0;
      this.DeathSpriteIndex = 0;
    }

    if (!this.isWalking && !this.isAttacking && !this.isDying) {
      this.IdleSpriteDuration++;
      if (this.IdleSpriteDuration >= this.IdleSpriteNumber * 10) {
        this.IdleSpriteIndex = 0;
      } else {
        this.IdleSpriteIndex =
          Math.floor(this.IdleSpriteIndex / 10) % this.IdleSpriteNumber;
      }
    } else {
      this.IdleSpriteDuration = 0;
      this.IdleSpriteIndex = 0;
    }
  }
}

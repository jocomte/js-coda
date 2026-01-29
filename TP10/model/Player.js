export default class Player {
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

    // === Gestion des positions pour interpolation ===

    // 1. Position "Cible"
    this.position = Array.isArray(position)
      ? { x: position[0], y: position[1] }
      : position;

    // 2. Position Précédente
    this.prevPosition = { ...this.position };

    // 3. Position de Rendu
    this.renderPosition = { ...this.position };

    // =========================================================

    this.health = health;
    this.isWalking = false;
    this.isAttacking = false;
    this.isDying = false;
    this.isIdle = false;
    this.direction = "down";

    // Compteurs d'animation
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

    // Si tu stockes l'élément HTML (img/div) dans options, il sera attaché ici
    Object.assign(this, options);
  }

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

    Object.assign(this, serverData);
  }

  interpolate(alpha) {
    const t = Math.max(0, Math.min(1, alpha));
    this.renderPosition.x =
      this.prevPosition.x + (this.position.x - this.prevPosition.x) * t;
    this.renderPosition.y =
      this.prevPosition.y + (this.position.y - this.prevPosition.y) * t;
  }

  animate() {
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

  /**
   * --- NOUVELLE MÉTHODE ---
   * Appelée par Game.js avant de supprimer le joueur de la mémoire.
   * Sert à nettoyer les éléments graphiques persistants (DOM, Sons, etc).
   */
  destroy() {
    // CAS 1 : Si tu utilises des éléments HTML (<img> ou <div>) stockés dans 'this.element'
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      // ou simplement: this.element.remove();
    }

    // CAS 2 : Si tu as un sprite PIXI.js ou Phaser stocké dans 'this.sprite'
    if (this.sprite) {
      this.sprite.destroy();
    }

    // Log de vérification (à retirer plus tard)
    console.log(`Joueur ${this.id} (Sprite) nettoyé.`);
  }
}

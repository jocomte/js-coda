class Player {
  constructor(
    id = 0,
    name = "Anonymous",
    skin = "default",
    position = { x: 0, y: 0 },
    health = 100,
    options = {}
  ) {
    this.id = id;
    this.name = name;
    this.skin = skin;
    this.position = position;
    this.health = health;
    this.isWalking = false;
    this.isAttacking = false;
    this.isDying = false;
    this.isIdle = false;
    this.direction = "down";
    this.WalkSpriteDuration = 0;
    this.WalkSpriteIndex = 0;
    this.WalkSpriteNumber = 9;
    this.AttackSpriteDuration = 0;
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
    // Attributs supplémentaires du backend
    Object.assign(this, options);
  }

  animate() {
    // the player is walking
    if (this.isWalking) {
      this.currentWalkFrame++;
      if (this.currentWalkFrame >= this.WalkSpriteDuration) {
        this.currentWalkFrame = 0;
        this.WalkSpriteIndex++;
        if (this.WalkSpriteIndex >= this.WalkSpriteNumber) {
          this.WalkSpriteIndex = 0;
        }
      }
    }
    // the player is attacking
    else if (this.isAttacking) {
      this.AttackSpriteDuration++;
      if (this.AttackSpriteDuration >= this.AttackSpriteNumber) {
        this.AttackSpriteIndex = 0;
      }
    }
    // the player is dying
    else if (this.isDying) {
      this.DeathSpriteDuration++;
      if (this.DeathSpriteDuration >= this.DeathSpriteNumber) {
        this.DeathSpriteIndex = 0;
      }
    } else {
      this.IdleSpriteDuration++;
      if (this.IdleSpriteDuration >= this.IdleSpriteNumber) {
        this.IdleSpriteIndex = 0;
      }
    }
  }
}
console.log("Player class loaded");

// Tests
const player1 = new Player();
console.log("Player 1:", player1);

const player2 = new Player(1, "Alice", "warrior", { x: 10, y: 20 });
console.log("Player 2:", player2);

// Test animation
player1.isWalking = true;
player1.WalkSpriteDuration = 2; // set duration for testing
for (let i = 0; i < 10; i++) {
  player1.animate();
  console.log(`Walk frame ${i}: index ${player1.WalkSpriteIndex}`);
}

/*walkspriteduration= 2;  WalkSpriteIndex=0 ; WalkSpriteNumber = 9; isWalking = false; isAttacking; isDying */

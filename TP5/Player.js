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
    // Attributs supplémentaires du backend
    Object.assign(this, options);
  }

  // Méthode pour déplacer le joueur
  move(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
  }

  // Méthode pour infliger des dégâts
  takeDamage(damage) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }

  // Méthode pour soigner
  heal(amount) {
    this.health += amount;
  }

  // Méthode pour vérifier si le joueur est vivant
  isAlive() {
    return this.health > 0;
  }

  // Méthode pour obtenir les informations du joueur
  getInfo() {
    return `${this.name} (${this.skin}) at (${this.position.x}, ${this.position.y}) - Health: ${this.health}`;
  }

  // Méthode pour mettre à jour les attributs depuis le serveur
  updateFromServer(data) {
    Object.assign(this, data);
  }
}

// Tests
const player1 = new Player();
console.log("Player 1 initial:", player1.getInfo());

const player2 = new Player(1, "Alice", "warrior", { x: 10, y: 20 });
console.log("Player 2 initial:", player2.getInfo());

// Test move
player1.move(5, 3);
console.log("Player 1 after move:", player1.getInfo());

// Test takeDamage
player2.takeDamage(30);
console.log("Player 2 after damage:", player2.getInfo());
console.log("Player 2 is alive:", player2.isAlive());

// Test heal
player2.heal(20);
console.log("Player 2 after heal:", player2.getInfo());

// Test excessive damage
player2.takeDamage(150);
console.log("Player 2 after excessive damage:", player2.getInfo());
console.log("Player 2 is alive:", player2.isAlive());

// Test with options (attributs backend)
const player3 = new Player(2, "Bob", "mage", { x: 0, y: 0 }, 100, {
  level: 3,
  experience: 500,
});
console.log("Player 3 with backend attributes:", player3);

// Test update from server
player3.updateFromServer({ level: 4, experience: 600, serverAttr: "updated" });
console.log("Player 3 after server update:", player3);

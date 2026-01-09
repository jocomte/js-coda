//////////////////////// Code fourni (ne pas moidifier) ////////////////////////

// Définir la taille du tableau d'élèves au hasard entre 7 et 10 élèves
let taille_minimum = 7;
let taille_maximum = 10;
let taille =
  Math.floor(Math.random() * (taille_maximum - taille_minimum + 1)) +
  taille_minimum;

// Déclarer le tableau pour stocker les élèves
let eleves = [];
// Définir la note maximale (pas besoin de définir la note minimale car elle est 0 par défaut)
let note_maximum = 20;

// Liste manuelle de prénoms
let prenoms = [
  "Tev",
  "Fidel",
  "Enzo",
  "Kenzo",
  "Romain",
  "Tom",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Kate",
  "Liam",
  "Mia",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Rose",
  "Sam",
  "Tina",
  "Uma",
  "Victor",
  "Wendy",
  "Xavier",
  "Yara",
  "Zoe",
];

// Itérer autant de fois qu'on a d'élèves à générer
for (let i = 0; i < taille; i++) {
  // Générer un prénom aléatoire parmi la liste
  let prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  // Générer des notes aléatoires entre 0 et note_maximum (inclus)
  let noteFrancais = Math.floor(Math.random() * (note_maximum + 1));
  let noteMaths = Math.floor(Math.random() * (note_maximum + 1));
  let noteHistoire = Math.floor(Math.random() * (note_maximum + 1));
  // Créer l'objet élève
  let eleve = {
    prenom: prenom,
    noteFrancais: noteFrancais,
    noteMaths: noteMaths,
    noteHistoire: noteHistoire,
  };
  // Ajouter l'élève généré au tableau
  eleves.push(eleve);
}

///////////////////////////////////////////////////////////////////////////////

//Partie 1
// Calculer la moyenne pour chaque élève
for (let eleve of eleves) {
  eleve.moyenne =
    (eleve.noteFrancais + eleve.noteMaths + eleve.noteHistoire) / 3;
}
let eleves_non_tries = eleves.slice(); // Copier le tableau non trié pour l'affichage final
console.log("Élèves non triés :"); // Afficher les élèves non triés
for (let eleve of eleves) {
  console.log(eleve.prenom + " : " + eleve.moyenne.toFixed(1));
}
console.log("Taille du tableau : " + eleves.length); // Afficher le nombre d'éléments dans le tableau
console.log("Note maximale possible : " + note_maximum); // Afficher la note maximale possible
console.log("Note minimale possible : 0"); // Afficher la note minimale possible

//Partie 2 :Premiere étape tri par sélection
// Trouver l'index de l'élève avec la plus petite moyenne dans le tableau non trié
let index_min = 0; // Initialiser l'index de l'élève avec la plus petite moyenne à 0
for (let i = 1; i < eleves.length; i++) {
  // Parcourir le tableau à partir de l'indice 1
  if (eleves[i].moyenne < eleves[index_min].moyenne) {
    // Si la moyenne actuelle est plus petite que celle à index_min
    index_min = i; // Mettre à jour index_min
  }
}
console.log(
  "Élève avec la plus petite moyenne : " +
    eleves[index_min].prenom +
    " (" +
    eleves[index_min].moyenne.toFixed(1) +
    ")"
); // Afficher l'élève avec la plus petite moyenne

/*Partie 3 – Échange de valeurs
Échanger l'élève avec la plus petite moyenne trouvée avec l'élève situé à l’indice 0.*/
let temp = eleves[0]; // Stocker temporairement l'élève à l'indice 0
eleves[0] = eleves[index_min]; // Placer l'élève avec la plus petite moyenne à l'indice 0
eleves[index_min] = temp; // Placer l'ancien élève de l'indice 0 à l'ancien index_min
console.log("Tableau après échange :"); // Afficher le tableau après l'échange
for (let eleve of eleves) {
  console.log(eleve.prenom + " : " + eleve.moyenne.toFixed(1));
}

//Partie 4 – Tri par sélection complet
let echanges = 0; // Compteur du nombre d'échanges effectués
for (let i = 0; i < eleves.length - 1; i++) {
  // Boucle principale pour chaque position à trier
  // Trouver l'index de l'élève avec la plus petite moyenne dans la sous-partie non triée du tableau
  let index_min = i; // Initialiser index_min à la position actuelle
  for (let j = i + 1; j < eleves.length; j++) {
    // Parcourir la sous-partie non triée
    if (eleves[j].moyenne < eleves[index_min].moyenne) {
      // Si une moyenne plus petite est trouvée
      index_min = j; // Mettre à jour index_min
    }
  }
  // Échanger l'élève avec la plus petite moyenne trouvée avec l'élève à l'indice i
  let temp = eleves[i]; // Stocker temporairement l'élève à l'indice i
  eleves[i] = eleves[index_min]; // Placer l'élève avec la plus petite moyenne à l'indice i
  eleves[index_min] = temp; // Placer l'ancien élève à l'ancien index_min
  echanges++; // Incrémenter le compteur d'échanges
  console.log("Tableau après l'étape " + (i + 1) + " :"); // Afficher le tableau après chaque étape
  for (let eleve of eleves) {
    console.log(eleve.prenom + " : " + eleve.moyenne.toFixed(1));
  }
}
//Partie 5 – Affichage du résultat
console.log("Tableau non trié :"); // Afficher le tableau original non trié
for (let eleve of eleves_non_tries) {
  console.log(eleve.prenom + " : " + eleve.moyenne.toFixed(1));
}
console.log("Tableau des élèves triés par moyenne croissante :"); // Afficher le tableau trié en ordre croissant des moyennes
for (let eleve of eleves) {
  console.log(eleve.prenom + " : " + eleve.moyenne.toFixed(1));
}

console.log("Nombre total d'échanges effectués : " + echanges); // Afficher le nombre d'échanges pour le tri croissant

// Tri par sélection pour une matière en particulier (noteFrancais)
let eleves_par_francais = eleves.slice(); // Copier le tableau trié pour le tri par noteFrancais
let echanges_francais = 0; // Compteur d'échanges pour le tri par noteFrancais
for (let i = 0; i < eleves_par_francais.length - 1; i++) {
  // Boucle principale pour chaque position à trier
  // Trouver l'index de l'élève avec la plus petite note en Français dans la sous-partie non triée du tableau
  let index_min = i; // Initialiser index_min à la position actuelle
  for (let j = i + 1; j < eleves_par_francais.length; j++) {
    // Parcourir la sous-partie non triée
    if (
      eleves_par_francais[j].noteFrancais <
      eleves_par_francais[index_min].noteFrancais
    ) {
      // Si une note plus petite est trouvée
      index_min = j; // Mettre à jour index_min
    }
  }
  // Échanger l'élève avec la plus petite note en Français trouvée avec l'élève à l'indice i
  let temp = eleves_par_francais[i]; // Stocker temporairement l'élève à l'indice i
  eleves_par_francais[i] = eleves_par_francais[index_min]; // Placer l'élève avec la plus petite note à l'indice i
  eleves_par_francais[index_min] = temp; // Placer l'ancien élève à l'ancien index_min
  echanges_francais++; // Incrémenter le compteur d'échanges
}
console.log("Tableau trié par note en Français :"); // Afficher le tableau trié par noteFrancais
for (let eleve of eleves_par_francais) {
  console.log(eleve.prenom + " : " + eleve.noteFrancais);
}
console.log(
  "Nombre total d'échanges effectués pour le tri par Français : " +
    echanges_francais
); // Afficher le nombre d'échanges pour le tri par Français

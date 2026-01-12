function genererEleves() {
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

  // Calculer la moyenne pour chaque élève
  for (let eleve of eleves) {
    eleve.moyenne =
      (eleve.noteFrancais + eleve.noteMaths + eleve.noteHistoire) / 3;
  }

  return eleves;
}
// Test de la fonction genererEleves - affiche le tableau généré
console.log(genererEleves());

// Fonction pour afficher les élèves avec leur moyenne
function afficherEleves(tableau) {
  for (let eleve of tableau) {
    console.log(eleve.prenom + " : " + eleve.moyenne.toFixed(1));
  }
}
// Génère un tableau d'élèves et l'affiche
let eleves = genererEleves();
afficherEleves(eleves);

// Fonction pour trouver l'index de l'élève avec la moyenne la plus basse à partir d'un index donné
function trouverMoyenneMin(tableau, indexDepart) {
  let index_min = indexDepart;
  for (let i = indexDepart + 1; i < tableau.length; i++) {
    if (tableau[i].moyenne < tableau[index_min].moyenne) {
      index_min = i;
    }
  }
  return index_min;
}
// Test de la fonction trouverMoyenneMin - affiche l'index de l'élève avec la moyenne la plus basse
console.log(trouverMoyenneMin(eleves, 0));

// Fonction pour afficher les données statistiques des élèves
function afficherDonnees(tableau) {
  let nombreEleves = tableau.length;
  let indexMin = trouverMoyenneMin(tableau, 0);
  let moyenneMin = tableau[indexMin].moyenne;
  let moyenneMax = -Infinity;
  for (let eleve of tableau) {
    if (eleve.moyenne > moyenneMax) {
      moyenneMax = eleve.moyenne;
    }
  }
  console.log("Nombre d'élèves : " + nombreEleves);
  console.log("Moyenne la plus basse : " + moyenneMin.toFixed(1));
  console.log("Moyenne la plus haute : " + moyenneMax.toFixed(1));
}
// Affiche les données statistiques des élèves
afficherDonnees(eleves);

// Fonction pour échanger deux éléments dans un tableau.
function swap(tableau, indexA, indexB) {
  let temp = tableau[indexA];
  tableau[indexA] = tableau[indexB];
  tableau[indexB] = temp;
}
// Échange les élèves aux indices 0 et 1, puis affiche le tableau modifié
swap(eleves, 0, 1);
afficherEleves(eleves);

// Fonction pour trier un tableau par sélection selon la moyenne
function triSelection(tableau) {
  for (let j = 0; j < tableau.length - 1; j++) {
    for (let i = j + 1; i < tableau.length; i++) {
      if (tableau[j].moyenne > tableau[i].moyenne) {
        swap(tableau, j, i); // Échange les élèves si nécessaire
      }
    }
  }
}

// Message indiquant le début du tri par sélection
console.log("Tri par sélection complet :");
// Applique le tri par sélection au tableau d'élèves
triSelection(eleves);
// Affiche le tableau trié
afficherEleves(eleves);

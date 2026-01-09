//////////////////////// Code fourni (ne pas moidifier) ////////////////////////

// Définir la taille du tableau de notes au hasard entre 15 et 30 éléments
let taille_minimum = 7;
let taille_maximum = 10;
let taille =
  Math.floor(Math.random() * (taille_maximum - taille_minimum + 1)) +
  taille_minimum;

// Déclarer le tableau pour stocker les notes
let notes = [];
// Définir la note maximale (pas besoin de définir la note minimale car elle est 0 par défaut)
let note_maximum = 20;

// Itérer autant de fois qu'on a de notes aléatoires à générer
for (let i = 0; i < taille; i++) {
  // Générer une note aléatoire entre 0 et note_maximum (inclus)
  let note = Math.floor(Math.random() * (note_maximum + 1));
  // Ajouter la note générée au tableau
  notes.push(note);
}

///////////////////////////////////////////////////////////////////////////////

//Partie 1
let notes_non_triees = notes.slice(); // Copier le tableau non trié pour l'affichage final
console.log("Tableau des notes non triées : " + notes); // Afficher le tableau original des notes
console.log("Taille du tableau : " + notes.length); // Afficher le nombre d'éléments dans le tableau
console.log("Note maximale possible : " + note_maximum); // Afficher la note maximale possible
console.log("Note minimale possible : 0"); // Afficher la note minimale possible (toujours 0)

//Partie 2 :Premiere étape tri par sélection
// Trouver l'index de la plus petite note dans le tableau non trié
let index_min = 0; // Initialiser l'index de la plus petite note à 0
for (let i = 1; i < notes.length; i++) {
  // Parcourir le tableau à partir de l'indice 1
  if (notes[i] < notes[index_min]) {
    // Si la note actuelle est plus petite que celle à index_min
    index_min = i; // Mettre à jour index_min
  }
}
console.log("Index de la plus petite note : " + index_min); // Afficher l'index de la plus petite note
console.log("Valeur de la plus petite note : " + notes[index_min]); // Afficher la valeur de la plus petite note

/*Partie 3 – Échange de valeurs
Échanger la plus petite valeur trouvée avec la valeur située à l’indice 0.*/
let temp = notes[0]; // Stocker temporairement la valeur à l'indice 0
notes[0] = notes[index_min]; // Placer la plus petite note à l'indice 0
notes[index_min] = temp; // Placer l'ancienne valeur de l'indice 0 à l'ancien index_min
console.log("Tableau après échange : " + notes); // Afficher le tableau après l'échange

//Partie 4 – Tri par sélection complet
let echanges = 0; // Compteur du nombre d'échanges effectués
for (let i = 0; i < notes.length - 1; i++) {
  // Boucle principale pour chaque position à trier
  // Trouver l'index de la plus petite note dans la sous-partie non triée du tableau
  let index_min = i; // Initialiser index_min à la position actuelle
  for (let j = i + 1; j < notes.length; j++) {
    // Parcourir la sous-partie non triée
    if (notes[j] < notes[index_min]) {
      // Si une note plus petite est trouvée
      index_min = j; // Mettre à jour index_min
    }
  }
  // Échanger la plus petite note trouvée avec la note à l'indice i
  let temp = notes[i]; // Stocker temporairement la valeur à l'indice i
  notes[i] = notes[index_min]; // Placer la plus petite note à l'indice i
  notes[index_min] = temp; // Placer l'ancienne valeur à l'ancien index_min
  echanges++; // Incrémenter le compteur d'échanges
  console.log("Tableau après l'étape " + (i + 1) + " : " + notes); // Afficher le tableau après chaque étape
}
//Partie 5 – Affichage du résultat
console.log("Tableau non trié : " + notes_non_triees); // Afficher le tableau original non trié
console.log("Tableau des notes triées : " + notes); // Afficher le tableau trié en ordre croissant

//Bonus
console.log("Nombre total d'échanges effectués : " + echanges); // Afficher le nombre d'échanges pour le tri croissant

//Récupérer le tableau trié et le trier par ordre décroissant avec un copier-coller modifié de votre tri par sélection
let notes_decroissantes = notes.slice(); // Copier le tableau trié pour le tri décroissant
let echanges_decroissants = 0; // Compteur d'échanges pour le tri décroissant
for (let i = 0; i < notes_decroissantes.length - 1; i++) {
  // Boucle principale pour le tri décroissant
  // Trouver l'index de la plus grande note dans la sous-partie non triée du tableau
  let index_max = i; // Initialiser index_max à la position actuelle
  for (let j = i + 1; j < notes_decroissantes.length; j++) {
    // Parcourir la sous-partie non triée
    if (notes_decroissantes[j] > notes_decroissantes[index_max]) {
      // Si une note plus grande est trouvée
      index_max = j; // Mettre à jour index_max
    }
  }
  // Échanger la plus grande note trouvée avec la note à l'indice i
  let temp = notes_decroissantes[i]; // Stocker temporairement la valeur à l'indice i
  notes_decroissantes[i] = notes_decroissantes[index_max]; // Placer la plus grande note à l'indice i
  notes_decroissantes[index_max] = temp; // Placer l'ancienne valeur à l'ancien index_max
  echanges_decroissants++; // Incrémenter le compteur d'échanges
  console.log("Tableau après l'étape " + (i + 1) + " : " + notes_decroissantes); // Afficher le tableau après chaque étape
}
console.log("Nombre total d'échanges effectués : " + echanges_decroissants); // Afficher le nombre d'échanges pour le tri décroissant

console.log(
  "Tableau des notes triées en ordre décroissant : " + notes_decroissantes
); // Afficher le tableau trié en ordre décroissant

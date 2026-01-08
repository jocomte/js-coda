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
console.log("Tableau des notes non triées : " + notes);
console.log("Taille du tableau : " + notes.length);
console.log("Note maximale possible : " + note_maximum);
console.log("Note minimale possible : 0");

//Partie 2 :Premiere étape tri par sélection
// Trouver l'index de la plus petite note dans le tableau non trié
let index_min = 0;
for (let i = 1; i < notes.length; i++) {
  if (notes[i] < notes[index_min]) {
    index_min = i;
  }
}
console.log("Index de la plus petite note : " + index_min);
console.log("Valeur de la plus petite note : " + notes[index_min]);

/*Partie 3 – Échange de valeurs
Échanger la plus petite valeur trouvée avec la valeur située à l’indice 0.*/
let temp = notes[0];
notes[0] = notes[index_min];
notes[index_min] = temp;
console.log("Tableau après échange : " + notes);

//Partie 4 – Tri par sélection complet
let echanges = 0;
for (let i = 0; i < notes.length - 1; i++) {
  // Trouver l'index de la plus petite note dans la sous-partie non triée du tableau
  let index_min = i;
  for (let j = i + 1; j < notes.length; j++) {
    if (notes[j] < notes[index_min]) {
      index_min = j;
      echanges++;
    }
  }
  // Échanger la plus petite note trouvée avec la note à l'indice i
  let temp = notes[i];
  notes[i] = notes[index_min];
  notes[index_min] = temp;
  console.log("Tableau après l'étape " + (i + 1) + " : " + notes);
}
//Partie 5 – Affichage du résultat
console.log("Tableau non trié : " + notes_non_triees);
console.log("Tableau des notes triées : " + notes);

//Bonus
console.log("Nombre total d'échanges effectués : " + echanges);

//Récupérer le tableau trié et le trier par ordre décroissant avec un copier-coller modifié de votre tri par sélection
let notes_decroissantes = notes.slice(); // Copier le tableau trié pour le tri décroissant
for (let i = 0; i < notes_decroissantes.length - 1; i++) {
  // Trouver l'index de la plus grande note dans la sous-partie non triée du tableau
  let index_max = i;
  for (let j = i + 1; j < notes_decroissantes.length; j++) {
    if (notes_decroissantes[j] > notes_decroissantes[index_max]) {
      index_max = j;
    }
  }
  // Échanger la plus grande note trouvée avec la note à l'indice i
  let temp = notes_decroissantes[i];
  notes_decroissantes[i] = notes_decroissantes[index_max];
  notes_decroissantes[index_max] = temp;
}
console.log(
  "Tableau des notes triées en ordre décroissant : " + notes_decroissantes
);

// Ce script JavaScript démontre les concepts de base de la programmation :
// - Objets et propriétés
// - Tableaux
// - Boucles (for, while)
// - Conditions (if-else)
// - Calculs de moyennes et attributions de mentions
// Il simule la gestion d'une classe avec des élèves, leurs notes et leurs résultats.

//Partie 1 : Définition de la classe et variables de base
const CLASSE = {
  nom: "B1-A",
};
console.log(CLASSE.nom);

let nombre_eleves = 3;
console.log(nombre_eleves);

let isopen = true;
console.log(isopen);

//Partie 2 : Création d'un objet élève avec prénom et notes
let eleve1 = {
  prénom: "enzo",
  note_math: 15,
  note_francais: 12,
};
console.log(eleve1.prénom);

//partie 3 : Création d'autres élèves et d'un tableau d'élèves

let eleve2 = {
  prénom: "Fidel",
  note_math: 17,
  note_francais: 13,
};
let eleve3 = {
  prénom: "Tevaitea",
  note_math: 12,
  note_francais: 14,
};

// Création d'un tableau contenant tous les élèves
let Eleves = [eleve1, eleve2, eleve3];

// Mise à jour du nombre d'élèves basé sur la longueur du tableau
nombre_eleves = Eleves.length;

// Boucle pour afficher le prénom de chaque élève
for (let i = 0; i < nombre_eleves; i++) {
  console.log("L'élève " + Eleves[i].prénom);
}

//Partie 4 : Calcul de la moyenne pour chaque élève
for (let i = 0; i < nombre_eleves; i++) {
  // Calcul de la moyenne : (note_math + note_francais) / 2
  let moyenne = (Eleves[i].note_math + Eleves[i].note_francais) / 2;
  // Ajout de la propriété moyenne à l'objet élève
  Eleves[i].moyenne = moyenne;
  console.log("La moyenne de " + Eleves[i].prénom + " est de " + moyenne);
}
//Partie 5 : Vérification de l'admission (moyenne >= 10)
for (let i = 0; i < nombre_eleves; i++) {
  if (Eleves[i].moyenne >= 10) {
    console.log(Eleves[i].prénom + " est admis.");
  } else {
    console.log(Eleves[i].prénom + " est refusé.");
  }
}
//Partie 6 : Attribution de mentions selon la moyenne
for (let i = 0; i < nombre_eleves; i++) {
  if (Eleves[i].moyenne >= 16) {
    Eleves[i].mention = "Très bien";
  } else if (Eleves[i].moyenne >= 14) {
    Eleves[i].mention = "Bien";
  } else if (Eleves[i].moyenne >= 12) {
    Eleves[i].mention = "Assez bien";
  } else if (Eleves[i].moyenne >= 10) {
    Eleves[i].mention = "Passable";
  } else {
    Eleves[i].mention = "Aucune mention";
  }
  console.log(Eleves[i].prénom + " a la mention : " + Eleves[i].mention);
}

//Partie 7 : Comptage des élèves admis avec une boucle while
let i = 0;
let eleve_admis = 0;
while (i < nombre_eleves) {
  if (Eleves[i].moyenne >= 10) {
    eleve_admis++;
  }
  i++;
}
console.log("Le nombre d'élèves admis est de : " + eleve_admis);

//Bonus : Calcul de la moyenne de la classe et ajout d'un nouvel élève
let total_moyenne = 0;
for (let i = 0; i < nombre_eleves; i++) {
  total_moyenne += Eleves[i].moyenne;
}
let moyenne_classe = total_moyenne / nombre_eleves;
console.log("La moyenne de la classe est de : " + moyenne_classe);

// Ajout d'un nouvel élève au tableau
Eleves.push({
  prénom: "Ayoub",
  note_math: 10,
  note_francais: 10,
});
// Calcul de la moyenne pour Ayoub
let moyenne_ayoub = (10 + 10) / 2;
Eleves[nombre_eleves - 1].moyenne = moyenne_ayoub;
console.log("La moyenne d'Ayoub est de : " + moyenne_ayoub);
// Recalcul du total des moyennes avec le nouvel élève
let total_moyenne_updated = 0;
for (let i = 0; i < nombre_eleves; i++) {
  total_moyenne_updated += Eleves[i].moyenne;
}
let moyenne_classe_updated = total_moyenne_updated / nombre_eleves;
console.log(
  "La nouvelle moyenne de la classe est de : " + moyenne_classe_updated
);

// Mise à jour du nombre d'élèves.
nombre_eleves = Eleves.length;
console.log(nombre_eleves);

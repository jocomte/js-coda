// import { game } from "./main.js";
let playersStats = [];

function loadPlayers() {
  const button = document.getElementById("connectBtn");
  button.addEventListener("click", async () => {
    const address = document.getElementById("serverAddress").value.trim();
    if (!address) {
      alert("Veuillez entrer une adresse serveur (IP:PORT)");
      return;
    }

    const url = `http://${address}/api/listPlayers`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
      }

      const data = await response.json();
      let players = [];
      for (let i = 0; i < data.length; i++) {
        players.push(data[i]);
      }
      document.getElementById("serverAddress").style.display = "none";
      document.getElementById("connectBtn").style.display = "none";
      document.querySelector('label[for="serverAddress"]').style.display =
        "none";

      showPlayers(players);
      createRankingContainer(players);
      // console.log(players);
      // console.log("Nom :", data.name);
      // console.log("Nom :", data.name);
    } catch (error) {
      console.log("Erreur lors du chargement :", error);
    }

    // console.log(url);
  });
}

async function loadPlayerStats(name) {
  const address = document.getElementById("serverAddress").value.trim();
  if (!address) {
    alert("Veuillez entrer une adresse serveur (IP:PORT)");
    return;
  }

  // console.log(name);
  const url = `http://${address}/api/stats?name=${name}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }

    const data = await response.json();
    // console.log("zgbr", data);
    return data;
    // console.log("Nom :", data.name);
    // console.log("Nom :", data.name);
  } catch (error) {
    console.log("Erreur lors du chargement :", error);
  }

  // console.log(url);
}

// function loadRanking(ranking) {
//     let rank = [];
//     for (let player of ranking.isAlive) {
//         // console.log(player);
//         rank.push(player.name);
//     }

//     for (let player of ranking.isDying) {
//         rank.push(player.name);
//     }

//     console.log(rank);
//     return rank;
// }

function createPlayerSelect() {
  const container = document.getElementById("server-config");
  const label = document.createElement("label");
  label.setAttribute("for", "playerSelect");
  label.textContent = " 🎮 Voir les stats d'un joueur :";
  const span = document.createElement("span");
  span.id = "span";

  const select = document.createElement("select");
  select.id = "playerSelect";
  select.classList.add("player-select");
  const button = document.createElement("button");
  button.textContent = "Classement général";
  button.id = "generalRanking";

  container.appendChild(label);
  span.appendChild(select);
  span.appendChild(button);
  container.appendChild(span);
  // const buttonGR = document.getElementById("")

  // const buttonGene = document.getElementById("generalRanking");
  // button.addEventListener("click", () => {
  //     let rankingDiv = document.createElement("div");
  //     rankingDiv.id = "rankingContainer";
  //     rankingDiv.style.marginTop = "20px";
  //     document.body.appendChild(rankingDiv);
  //     console.log("hdbvhsgbv");
  // //     // Récupérer tous les joueurs du select avec leurs stats
  //     const options = Array.from(select.options);
  //     const playersForTable = options.map(opt => ({
  //         name: opt.value,
  //         totalKills: parseInt(opt.dataset.kills || 0),
  //         totalDeaths: parseInt(opt.dataset.deaths || 0),
  //         kdRatio: parseFloat(opt.dataset.kd || 0)
  //     }));

  //     // Afficher le tableau
  //     //     showGeneralRanking(playersForTable);
  // });
}

function showPlayers(players) {
  createPlayerSelect();
  const select = document.getElementById("playerSelect");
  select.innerHTML = "";

  players.forEach((player) => {
    const option = document.createElement("option");
    // console.log(player.name);
    let name = player.name;

    if (name.length > 9) {
      name = name.slice(0, 9) + "...";
    }

    option.value = player.name; // valeur complète (important)
    option.textContent = name;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selectedPlayerName = select.value;
    console.log("Joueur sélectionné :", selectedPlayerName);
    loadPlayerStats(selectedPlayerName).then((selectedPlayer) => {
      console.log(selectedPlayer);
      console.log("Joueur sélectionné :", selectedPlayer);
      showStatsPlayer(selectedPlayer);
    });

    // const selectedPlayer = await loadPlayerStats(selectedPlayerName);
  });
}

function showStatsPlayer(player) {
  // const rankingPlayer = findRankPlayer(player.name);
  const container = document.getElementById("server-config");
  const stats = document.createElement("div");
  const oldstats = document.getElementById("playerStats");
  if (oldstats) oldstats.remove();
  stats.innerHTML = `
        <strong>${player.name}</strong>
        <ul>
           <li>Parties jouées : <span>${player.gamesPlayed}</span></li>
            <li>Nombre de Kills : <span>${player.totalKills}</span></li>
            <li>Nombre de Morts : <span>${player.totalDeaths}</span></li>
            <li>Ratio K/D : <span>${player.kdRatio}</span></li>
            <li>Position dans le CDP : <span>${player.lastGameRank}</span></li>
            <li>Classement moyen : <span>${player.overallRanking}</span></li>

        </ul>
    `;

  stats.id = "playerStats";
  container.appendChild(stats);
}

function createRankingContainer(players) {
  const button = document.getElementById("generalRanking");

  button.addEventListener("click", async () => {
    playersStats = [];

    for (const p of players) {
      const stats = await loadPlayerStats(p.name);
      playersStats.push(stats);
    }

    showGeneralRanking(playersStats);
    sortBy(playersStats);
  });
}

function showGeneralRanking(players) {
  const rankingDiv = getRankingContainer();

  // Supprimer seulement l'ancien tableau
  const oldTable = rankingDiv.querySelector("table");
  if (oldTable) oldTable.remove();

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  table.innerHTML = `
        <thead>
            <tr>
                <th>Position</th>
                <th>Classement Moyen</th>
                <th>Joueur</th>
                <th>Kills</th>
                <th>Morts</th>
                <th>Ratio K/D</th>
                <th>Position CDP</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

  const tbody = table.querySelector("tbody");

  players.forEach((player, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.overallRanking}</td>
            <td>${player.name}</td>
            <td>${player.totalKills}</td>
            <td>${player.totalDeaths}</td>
            <td>${player.kdRatio}</td>
            <td>${player.lastGameRank}</td>
        `;
    tbody.appendChild(tr);
  });

  rankingDiv.appendChild(table);
}

function sortBy(players) {
  const div = getRankingContainer();

  // supprimer ancien select
  const oldSelect = document.getElementById("sortSelect");
  if (oldSelect) oldSelect.remove();

  const filter = document.createElement("select");
  filter.id = "sortSelect";

  const filters = ["Classement M", "NK", "NM", "Ratio K/D", "Position CDP"];

  filters.forEach((f) => {
    const option = document.createElement("option");
    option.value = f;
    option.textContent = f;
    filter.appendChild(option);
  });

  div.prepend(filter);

  filter.addEventListener("change", () => {
    let sortedPlayers = [...players];

    switch (filter.value) {
      case "Classement M":
        sortedPlayers.sort((a, b) => a.overallRanking - b.overallRanking);
        break;
      case "NK":
        sortedPlayers.sort((a, b) => b.totalKills - a.totalKills);
        break;
      case "NM":
        sortedPlayers.sort((a, b) => b.totalDeaths - a.totalDeaths);
        break;
      case "Ratio K/D":
        sortedPlayers.sort((a, b) => b.kdRatio - a.kdRatio);
        break;
      case "Position CDP":
        sortedPlayers.sort((a, b) => a.lastGameRank - b.lastGameRank);
        break;
    }

    showGeneralRanking(sortedPlayers);
  });
}

function getRankingContainer() {
  let div = document.getElementById("rankingContainer");

  if (!div) {
    div = document.createElement("div");
    div.id = "rankingContainer";
    div.style.marginTop = "20px";
    document.body.appendChild(div);
  }

  return div;
}

// function findRankPlayer(playerName) {
//     const rankingGame = JSON.parse(localStorage.getItem("ranking") || "{}");
//     const ranking = loadRanking(rankingGame);
//     let rankingList = {};

//     for (let i = 0; i < ranking.length; i++) {
//         const player = ranking[i];

//         if (!(player in rankingList)) {
//             rankingList[player] = [i + 1];
//         } else {
//             rankingList[player].push(i + 1);
//         }
//     }

//     console.log(rankingList);

//     if (!(playerName in rankingList)) return " "; // si le joueur n'existe pas

//     const positions = rankingList[playerName];      // récupère le tableau des positions
//     const lastPosition = positions[positions.length - 1];

//     return lastPosition;
//     // if(ranking[i] === playerName) return i + 1;

//     // return " ";
// }

// const name = "fidel";
loadPlayers();
// const ranking = JSON.parse(localStorage.getItem("ranking") || "{}");
// loadRanking(ranking);

// console.log(name);
// loadRanking(ranking);
// console.log(ranking);
// setInterval(() => {
//     // loadPlayers();
//     loadPlayerStats(name);
//     // let ranking = game.getRanking()
//     // console.log(ranking);
//     const ranking = JSON.parse(localStorage.getItem("ranking") || "{}");
//     loadRanking(ranking);
// }, 5000);

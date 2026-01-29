import Game from "./Model/game.js";
// import Player from "./js/Model/game.js";
import GameView from "./View/gameView.js";
import GameController from "./Controller/gameController.js";

const game = new Game();
const gameView = new GameView(game);
const gameController = new GameController(game, gameView);

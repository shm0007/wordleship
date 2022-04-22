import Validator from "./service/word-validator";
import { TurnOrder } from 'boardgame.io/core';
import { Ship }from './Ship';

const BOARD_SIZE = 100;

const SHIP_COUNT = 6;

const SHIPS_SIZE_2 = 1;
const SHIPS_SIZE_3 = 1;
const SHIPS_SIZE_4 = 1;
const SHIPS_SIZE_5 = 1;
const SHIPS_SIZE_6 = 1;
const SHIPS_SIZE_7 = 1;

export const Battleshipordle = {
  setup: () => ({ 
    board: Array(2).fill(Array(100).fill(null)),
    ships: Array(2).fill(Array()),
    oldBoardState: null
   }),

  phases: {
    //handle building ship words
    setup: {
      start: true,
      next: 'attack',
      moves: {
        insertLetter,
        clearLetter,
        resetBoard,
        placeShip
      },

      turn: {
        onBegin: (G, ctx) => { G.oldBoardState = G.board },
    // onBegin: setupShips(),
      }


    },
    attack: {
      moves: {
        insertLetter,
        clearLetter,
        submitAttack,
        resetBoard
      }
    }
  },

  turn: {
    onBegin: (G, ctx) => { G.oldBoardState = G.board },
    order: TurnOrder.DEFAULT
  }
};

/**
 * Input a letter into a given cell
 * @param {Object} G 
 * @param {Object} ctx 
 * @param {int} id id of the cell to insert into
 * @param {char} letter letter to insert into cell
 */
function insertLetter(G, ctx, board, cell_id, letter) {
  G.board[board][cell_id] = letter;
}

/**
 * Remove a letter from a cell
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} id 
 */
function clearLetter(G, ctx, id) {
  G.board[ctx.currentPlayer][id] = null;
}

/**
 * Validate and attack a ship
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} id 
 */
function submitAttack(G, ctx) {
  console.log("attack!");

  let enemy = getOtherPlayer();
  let word = findWord(G, ctx, enemy);

  if(Validator.validate(word)) {
    //Handle dealing ship damage
    console.log(`${word} is valid!`);
  }
  else {
    console.log(`${word} is not a valid word!`);
  }
}

/**
 * Place a ship in the beginning of the game
 * @param {object} G 
 * @param {object} ctx 
 * @param {object} id 
 */
function placeShip(G, ctx, id) {
  let ship = [];
  let player = getPlayer();
  
  let letter = '';
  let coord = 0;
  for(let i = 0; i < BOARD_SIZE; i++) {
    if(G.oldBoardState === null) {
      if(G.board[player][i] !== null) {
          letter = G.board[player][i];
          coord = i;
          ship.push({"letter": letter, "coord":coord});
          continue;
      }
    }

    else if(G.oldBoardState[player][i] !== G.board[player][i]) {
      letter = G.board[player][i];
      coord = i;
      ship.push({'letter': letter, 'coord': coord});
    }
  }

  console.log(ship);
  let word = Ship.toString(ship);
  if(Validator.validate(word)) {
    console.log(`${word} is valid!`);
    G.ships[player].push((ship));
    ctx.events.endTurn();
  }
  else {
    console.log(`${word} is not a valid word!`);
  }

}

/**
 * Find a word within the desired board space.
 * 
 * For simplicity, words can only made left -> right 
 * or top -> bottom. This means that in a valid case, we will 
 * encounter each letter in the order they are in the word.
 * 
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} board - board to search
 * @returns {string} - word it found
 */
function findWord(G, ctx, board) {

  let enemy = getOtherPlayer(ctx.currentPlayer);
  
  let word = "";
  for(let i = 0; i < BOARD_SIZE; i++) {
    if(G.oldBoardState === null) {
      if(G.board[enemy][i] !== null) {
          word += G.board[enemy][i];
          continue;
      }
    }

    if(G.oldBoardState[enemy][i] !== G.board[enemy][i]) {
      word += G.board[enemy][i];
    }
  }

  return word;
}

/**
 * Reset the board state to the beginning of the current player's
 * round. Useful for if they change too many words and don't know 
 * which was changed and which wasn't
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} id 
 */
function resetBoard(G, ctx, id) {
  G.board = G.oldBoardState;
}

//Grab the enemy player's index
function getOtherPlayer(currentPlayer) {
    return currentPlayer === 1 ? 0 : 1;
}

function getPlayer() {
  return 0;
}
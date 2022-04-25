import Validator from "./service/word-validator";
import { TurnOrder } from 'boardgame.io/core';
import { Ship }from './Ship';
import { Instructions } from './instructions';

const BOARD_SIZE = 100;

//Number of ships for each player
// ship_size: number of ships
const SHIP_COUNT = 6;
const ship_factory = {
  3: 1,
  4: 2,
  5: 2,
  6: 1,
  7: 1
}

const MIN_SHIP_SIZE = 3;
const MAX_SHIP_SIZE = 7;

export const Battleshipordle = {

  setup: () => ({
    board: Array(2).fill(Array(100).fill(null)),
    ships: Array(2).fill(Array()),
    oldBoardState: null,
    ships_placed: 0,
    current_ship_size: 0,
    current_instruction: null
   }),

  phases: {
    //handle building ship words
    setup: {
      start: true,
      next: 'attack',
      onBegin: (G, ctx) => { G.current_ship_size = MIN_SHIP_SIZE;},
      endIf: allShipsPlaced,
      moves: {
        insertLetter,
        clearLetter,
        resetBoard,
        placeShip
      },

      turn: {
        onBegin: beginSetupTurn,
        onEnd: (G, ctx) => { if(ctx.currentPlayer == "0") { G.ships_placed++; console.log("total ships:" + G.ships_placed) } }
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
  let legalPlacement = false;
  let legalWord = false;
  console.log("attack!");


  let enemy = getOtherPlayer();
  let wordObject = findWord(G, ctx, enemy);
  let word = Ship.toString(wordObject);

  legalPlacement = correctPosition(wordObject);
  legalWord = Validator.validate(word);

  if(legalWord) {
    //Handle dealing ship damage
    console.log(`${word} is valid!`);
  }
  else {
    console.log(`${word} is not a valid word!`);
  }

  if(legalPlacement){
    console.log('Valid word placement')
  }
  else{
    console.log('Illegal word placement')
  }

  if(legalWord && legalPlacement){
    //handle ship damage and updates
    executeAttack(G, ctx, wordObject);
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
  let player = getPlayer(ctx);
  
  let letter = '';
  let coord = 0;
  let legalPlacement = true;
  let legalWord = false;

  for(let i = 0; i < BOARD_SIZE; i++) {
    if(G.oldBoardState === null) {
      if(G.board[player][i] !== null) {
          letter = G.board[player][i];
          coord = i;
          ship.push({"letter": letter, "coord":coord, "status": "safe"});
          continue;
      }
    }

    else if(G.oldBoardState[player][i] !== G.board[player][i]) {
      letter = G.board[player][i];
      coord = i;
      ship.push({'letter': letter, 'coord': coord, "status" : "safe"});
    }
  }

  console.log(ship);


  legalPlacement = correctPosition(ship);

  if(!legalPlacement === true){
    console.log('Illegal word placement')
  }

  let word = Ship.toString(ship);
  legalWord = Validator.validate(word);

  if(!legalWord) {
    console.log(`${word} is not a valid word!`);
  }

  let expectedLength = ship.length === G.current_ship_size;

  if(!expectedLength) {
    console.log(`Illegal length ${ship.length} == ${G.current_ship_size}`);
  }

  if(legalWord && legalPlacement && expectedLength) {
    G.ships[player].push((ship));
    G.oldBoardState = G.board;

    //increment the number of ships that have been placed for both players
    if(ctx.currentPlayer == 1) {
      G.ships_placed++;
    }
    ctx.events.endTurn();
  }
}

/**
 * Find a word within the desired board space.
 * 
 * For simplicity, words can only made left -> right 
 * or top -> bottom. This means that in a valid case, we will 
 * encounter each letter in the order they are in the word.
 *
 *
 * MW- editing this function so that the word will have location data as well, changed
 * return value type from string to json object
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} board - board to search
 * @returns object - word it found
 */
function findWord(G, ctx, board) {
  let coord = 0;
  let letter = '';
  let enemy = getOtherPlayer(ctx.currentPlayer);
  
  let word = [];
  for(let i = 0; i < BOARD_SIZE; i++) {
    if(G.oldBoardState === null) {
      if(G.board[enemy][i] !== null) {
        coord = i;
        letter = G.board[enemy][i];
        word.push({'letter': letter, 'coord': coord});
          continue;
      }
    }

    if(G.oldBoardState[enemy][i] !== G.board[enemy][i]) {
      coord = i;
      letter = G.board[enemy][i];
      word.push({'letter': letter, 'coord': coord});
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

function getPlayer(ctx) {
  return ctx.currentPlayer;
}

/**
 * Helper function that checks for correct word placement on the board
 * Takes in an object with coord data, places this data into an array,
 * determines whether it is vertical or horizontal based on positions of
 * first 2 entries. Uses the alignment to see if the whole word is properly
 * aligned
 *
 * @param word - takes in a json object containing the word
 * @returns {boolean} returns true if placement is legal, if not false
 */
function correctPosition(word){
  let legalPlacement = true;
  let coordCheckArray = []
  let alignment = 1;

  for(let i = 0; i < word.length; i ++){
    coordCheckArray[i] = word[i].coord;
  }
  if(coordCheckArray[1]- coordCheckArray[0] === 1){
    alignment = 1;
  }
  else if(coordCheckArray[1] - coordCheckArray[0] === 10){
    alignment = 10;
  }
  else{
    legalPlacement = false;
  }

  let counter = 2;
  while(legalPlacement && counter < coordCheckArray.length){
    if(coordCheckArray[counter] - coordCheckArray[counter -1]
        !== alignment){
      legalPlacement = false;

    }
    counter ++;

  }
  return legalPlacement;
}

function allShipsPlaced(G, ctx) {
  return G.ships[0].length === SHIP_COUNT && G.ships[1].length === SHIP_COUNT;
}

function beginSetupTurn(G, ctx) {

  if(ctx.currentPlayer == 0) {
    if(G.ships_placed > ship_factory[G.current_ship_size]) {
      G.ships_placed = 0;
      G.current_ship_size++;
    }
  }

  G.current_instruction = Instructions.PLACE_SHIP(G.current_ship_size)
}




function executeAttack(G, ctx, word){
  let enemy = getOtherPlayer();
  let board = G.board[enemy];
  let ships = G.ships[enemy];
  let hits = [];


  for(let i = 0; i < word.length; i++){
    if(board[word.coord[i]] === null){
      hits.push({'letter': word.letter[i], 'coord': word.coord[i], 'status': 'miss'})
    }
    else{
      hits.push({'letter': word.letter[i], 'coord': word.coord[i], 'status': 'hit'});
    }

  }




}
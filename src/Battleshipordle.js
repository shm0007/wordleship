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
}
const ship_sizes = [4,4,5,6,7];

const MIN_SHIP_SIZE = 3;
const MAX_SHIP_SIZE = 7;

export const Battleshipordle = {
 
  setup: () => ({ 
    board: Array(2).fill(Array(100).fill({ "letter": null, "dirty": false })),
    ships: Array(2).fill([]),
    oldBoardState: null,
    ships_placed: 0,
    current_ship_size: 0,
    current_instruction: null
   }),

  phases: {
    setup: {
      start: true,
      next: 'attack',
      onBegin: (G, ctx) => { G.current_ship_size = MIN_SHIP_SIZE;},
      endIf: allShipsPlaced,
      onEnd: eraseBoards,
      moves: {
        insertLetter,
        clearLetter,
        resetBoard,
        placeShip
      },

      turn: {
        onBegin: beginSetupTurn,
      }
    },
    attack: {
      onBegin: setAttackMessage,
      moves: {
        insertLetter,
        clearLetter,
        submitAttack,
        resetBoard
      }
    }
  },

  turn: {
    onBegin: onTurnBegin,
    order: TurnOrder.DEFAULT,

  },
  endIf: checkEndGame 
};

/**
 * Input a letter into a given cell
 * @param {Object} G 
 * @param {Object} ctx 
 * @param {int} board board currently being rendered
 * @param {int} cell_id id of the cell to insert into
 * @param {char} letter letter to insert into cell
 */
function insertLetter(G, ctx, board, cell_id, letter) {

  //prevent the player from creating a crossword-like ship
  if(parseInt(ctx.currentPlayer) == board) {
    let letter = Ship.cellPartofShip(G, board, cell_id) 
    if(letter !== false) {
      return;
    }
  }

  G.board[board][cell_id]['letter'] = letter;
  G.board[board][cell_id]['dirty'] =  true;
}

/**
 * Remove a letter from a cell
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} id 
 */
function clearLetter(G, ctx, id) {
  if(G.oldBoardState === null) {
    G.board[ctx.currentPlayer][id]['letter'] = null;
    G.board[ctx.currentPlayer][id]['dirty'] = false;
  }
  //revert to what was on the board if a cell was overwritten
  else {
    G.board[ctx.currentPlayer][id] = G.oldBoardState[ctx.currentPlayer][id];
  }
}

/**
 * Validate and attack a ship
 * Checks if the attack is a valid word and if it is placed correctly
 * If both conditions are satisfied, the attack is executed
 * @param {object} G
 * @param {object} ctx
 */
function submitAttack(G, ctx) {
  console.log("attack!");

  let enemy = getOtherPlayer(getPlayer(ctx));
  let wordObject = findWord(G, ctx, enemy);
  let word = Ship.toString(wordObject);
  let legalPlacement = correctPosition(wordObject);
  let legalWord = Validator.validate(word);

  if(!legalWord) {
    console.log(`${word} is not a valid word!`);
  }

  if(!legalPlacement){
    console.log('Illegal word placement')
  }

  if(legalWord && legalPlacement){
      executeAttack(G,ctx, wordObject);
      console.log("ending turn...");
      ctx.events.endTurn();
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

  for(let i = 0; i < BOARD_SIZE; i++) {
    if(G.board[player][i]['dirty'] === true) {
        letter = G.board[player][i]['letter'];
        coord = i;
        ship.push({"letter": letter, "coord":coord, "status": "safe"});
    }
  }

  console.log(ship);

  let legalPlacement = correctPosition(ship);

  if(!legalPlacement === true){
    console.log('Illegal word placement')
  }

  let word = Ship.toString(ship);
  let legalWord = Validator.validate(word);
  
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
    if(parseInt(ctx.currentPlayer) === 1) {
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
    if(G.board[enemy][i]['dirty'] === true) {
      coord = i;
      letter = G.board[enemy][i]['letter'];
      console.log(`found ${letter} at ${i}`);
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
function resetBoard(G, ctx, board, id) {
  console.log(G);

  if(G.oldBoardState !== null) {
    //Unfortunately, due to the datatype of G, we cannot 
    //just copy arrays by assignment, so we have to iterate to restore
    //the old state
    for(let i = 0; i < G.board[board].length; i++) {
      G.board[board][i] = G.oldBoardState[board][i];
    }
  }
  else {
    for(let i = 0; i < G.board[board].length; i++) {
      G.board[board][i] = {'letter': null, 'dirty': false};
    }
  }
}

//Grab the enemy player's index
function getOtherPlayer(currentPlayer) {
    return parseInt(currentPlayer) === 1 ? 0 : 1;
}

function getPlayer(ctx) {
  return parseInt(ctx.currentPlayer);
}

/**
 * Helper function that checks for correct word placement on the board
 * Takes in an object with coordinate data, places this data into an array,
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

/**
 * Checks to see if all ships have been placed.
 * @param {*} G 
 * @param {*} ctx 
 * @returns 
 */
function allShipsPlaced(G, ctx) {
  return G.ships[0].length === SHIP_COUNT && G.ships[1].length === SHIP_COUNT;
}

/**
 * Check at the beginning of each round of turns that
 * We have an adequate amount of each sized ship
 * before moving onto the next size.
 * @param {*} G 
 * @param {*} ctx 
 */
function beginSetupTurn(G, ctx) {
  if(parseInt(ctx.currentPlayer) === 0) {
    if(G.ships_placed >= ship_factory[G.current_ship_size]) {
      G.ships_placed = 0;
      G.current_ship_size++;
    }
  }
  
  G.current_instruction = Instructions.PLACE_SHIP(G.current_ship_size);
  setAllTilesClean(G); 
}

/**
 * Save the old state of the board
 * Idk why or if this actually works because of the 
 * Immer issue but board behavior seems okay.
 * @param {*} G 
 * @param {*} ctx 
 */
function onTurnBegin(G, ctx) {
  setAllTilesClean(G);
  G.oldBoardState = G.board;
}

/**
 * Helper function that sets all tiles states to dirty
 * @param {object} G 
 */
function setAllTilesClean(G) {
  for(let b = 0; b < G.board.length; b++) {
    for(let i = 0; i < G.board[b].length; i++) {
      G.board[b][i]['dirty'] = false;
    }
  }
}


/**
 * Iterate through the board and erase all data on it
 * This is used between the setup and attack phase to clear the board
 * of leftover data from placing ships.
 * @param {*} G 
 */
function eraseBoards(G) {
  for(let b = 0; b < G.board.length; b++) {
    for(let i = 0; i < G.board[b].length; i++) {
      G.board[b][i] = {'letter': null, 'dirty': false}
    }
  }
}


/**Function that will update ships base on attacks
 * Takes an attack word and gets the position of the attack
 * Checks each position by looping through all ship locations
 * If the attack hits a ship, the ship status will be updated based on the
 * letters on the ship and the letter of the attack
 *
 * @param G
 * @param ctx
 * @param wordObj
 */
function executeAttack(G, ctx, wordObj){
    let enemy = getOtherPlayer(getPlayer(ctx));
    console.log('Execution started');
    let position = Ship.position(wordObj);
    let wordLetters = Ship.toString(wordObj).split('');
    let shipLetters = '';
    console.log(position.length);
    console.log(wordLetters);


    for(let p = 0; p < position.length; p++) {
        let hit = false;
        let shipCounter = 0;
        let posCounter = 0;
        while(!hit && shipCounter < G.ships[enemy].length){
            while(!hit && posCounter < G.ships[enemy][shipCounter].length){
                if(G.ships[enemy][shipCounter][posCounter].coord === position[p]){
                    hit = true;
                    shipLetters = Ship.toString(G.ships[enemy][shipCounter]).split('');
                    if(G.ships[enemy][shipCounter][posCounter]['letter'] === wordLetters[p]){
                        Ship.changeStatus(G.ships[enemy][shipCounter], posCounter, 0);
                        console.log("Direct Hit an position: " + position[p]);
                    }
                    else if(shipLetters.includes(wordLetters[p])){
                        if(G.ships[enemy][shipCounter][posCounter]['status'] !== Ship.getDirectHitStatus()) {
                            Ship.changeStatus(G.ships[enemy][shipCounter], posCounter, 1);
                            console.log("Letter in word at position: " + position[p]);
                        }
                    }
                    else{
                        if(G.ships[enemy][shipCounter][posCounter]['status'] !== Ship.getDirectHitStatus()) {
                            Ship.changeStatus(G.ships[enemy][shipCounter], posCounter, 2);
                            console.log("Letter not in word at position: " + position[p]);
                        }
                    }

                }

                //console.log('Ship position' + posCounter);
                posCounter ++;
            }
            posCounter = 0;
           // console.log('Ship # '+ shipCounter);
            shipCounter ++
        }
        if(!hit){
            console.log('Miss!');
        }
    }
}

function allShipsSunk(G, ctx){

    let enemy = parseInt(getOtherPlayer(getPlayer(ctx)));
    let gameOver = true;
    let shipCounter = 0;

    if(G.ships[enemy].length === 0){
        gameOver = false;
    }

    while(gameOver && shipCounter < G.ships[enemy].length){
        gameOver = Ship.checkShipSank(G.ships[enemy][shipCounter]);
        shipCounter ++;
    }
    return gameOver;
}

function checkEndGame(G, ctx) {
  if(allShipsSunk(G, ctx)){
      return { winner : ctx.currentPlayer }
  }
  return false;
}

function setAttackMessage(G, ctx) {
  console.log("Phase start!");
  G.current_instruction = Instructions.ATTACK();
}
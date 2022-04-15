export const Battleshipordle = {
  setup: () => ({ 
    board: [ Array(100).fill(null), Array(100).fill(null) ],
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
    onBegin: (G, ctx) => { G.oldBoardState = G.board }
  }
};

/**
 * Input a letter into a given cell
 * @param {Object} G 
 * @param {Object} ctx 
 * @param {int} id id of the cell to insert into
 * @param {char} letter letter to insert into cell
 */
function insertLetter(G, ctx, id, letter) {
  G.board[ctx.currentPlayer][id] = letter;
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
 * Certify a valid word 
 * and carry out an attack on the enemy player
 * @param {object} G 
 * @param {object} ctx 
 * @param {int} id 
 */
function submitAttack(G, ctx, id) {
  console.log("attack!");
  if(isValidWord()) {

  }
}

/**
 * Place a ship in the beginning of the game
 * @param {object} G 
 * @param {object} ctx 
 * @param {object} id 
 */
function placeShip(G, ctx, id) {

}

/**
 * Test if the word a player is attacking with is valid
 * @param {string} word 
 * @returns boolean
 */
function isValidWord(word) {
  return true;
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
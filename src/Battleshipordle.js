export const Battleshipordle = {
  setup: () => ({ 
    board: [ Array(100).fill(null), Array(100).fill(null)]
   }),

  phases: {
    //handle building ship words
    setup: {
      start: true,
      moves: {
        insertLetter,
        clearLetter
      }
    },
    attack: {
      moves: {
        insertLetter,
        clearLetter
      }
    }
  }
};

function insertLetter(G, ctx, id, letter) {
  G.board[ctx.currentPlayer][id] = letter;
}

function clearLetter(G, ctx, id) {
  G.board[ctx.currentPlayer][id] = null;
}
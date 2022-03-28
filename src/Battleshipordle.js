export const Battleshipordle = {
  setup: () => ({ cells: Array(100).fill(null) }),

  moves: {
    clickCell: (G, ctx, id) => {
      G.cells[id] = ctx.currentPlayer;
    },
    
    insertLetter: (G, ctx, id, letter) => {
      G.cells[id] = letter;
    },

    clearLetter: (G, ctx, id) => {
      G.cells[id] = null;
    }
  },
};
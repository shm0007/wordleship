export const Battleshipordle = {
    setup: () => ({ cells: Array(100).fill(null) }),
  
    moves: {
      clickCell: (G, ctx, id) => {
        G.cells[id] = ctx.currentPlayer;
      },
    },
  };
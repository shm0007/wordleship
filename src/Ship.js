export const Ship = {

    toString: (ship) => {
        let word = "";
        for(let i = 0; i < ship.length; i++ ) {
            word += ship[i]['letter'];
        }
        return word;
    },

    position: (ship) => {
        let position = [];
        for(let i = 0; i < ship.length; i++){
            position[i] = ship[i]['coord'];
        }
    },

    dump: (ship) => {
        console.log(ship);
    },

    /**
     * Checks to see if the currently rendering cell
     * is part of a ship
     * 
     * @param {object} G 
     * @param {int} board - id of board being rendered 
     * @param {id} id - id of cell being evaluated 
     * @returns 
     */
    cellPartofShip: (G, board, id) => {
        for(let i = 0; i < G.ships[board].length; i++) {

            for(let j = 0; j < G.ships[board][i].length; j++) {
                if(G.ships[board][i][j]['coord'] === id) {
                    return G.ships[board][i][j]['letter'];
                }
            }
        }
        return false;
    },

    shouldBeRendered: (player, board) => {

        //player is looking at their own board
        //needs to be loosely typed to work as player is a string
        if(player == board) {
            return true;
        }

        return false;
   }
}
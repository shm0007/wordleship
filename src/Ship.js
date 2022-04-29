const shipStatus = ['DirectHit', 'InWord', 'NotInWord', 'safe'];

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
        for (let i = 0; i < ship.length; i++) {
            position[i] = ship[i]['coord'];
        }
        return position;
    },

    letters: (ship) => {
        let letterArray = [];
        for (let i = 0; i < ship.length; i++) {
            letterArray[i] = ship[i]['letter'];
        }
        return letterArray;
    },

    /** Helper function to change the status of locations on a ship
     *
     * @param ship
     * @param index
     * @param attackCode
     */
    changeStatus: (ship, index, attackCode) => {
        ship[index].status = shipStatus[attackCode];
        console.log("Changing ship status to: " + shipStatus[attackCode]);
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
        for (let i = 0; i < G.ships[board].length; i++) {

            for(let j = 0; j < G.ships[board][i].length; j++) {
                if(G.ships[board][i][j]['coord'] === id) {
                    return G.ships[board][i][j];
                }
            }
        }
        return false;
    },

    shouldBeRendered: (player, board, cell) => {
        if(parseInt(player) === board) {
            return true;
        }

        if(cell['status'] !== "safe") {
            return true;
        }

        return false;
    },

    checkShipSank: (ship) => {
        let sank = true;
        let counter = 0;
        while(sank && counter < ship.length) {
            if(ship[counter].status !== shipStatus[0]) {
                sank = false;
            }
            counter++;
        }
        return sank;
    },

    getLocationStatus: (ship, index) =>{
        return ship[index]['status'];
    },

    getDirectHitStatus : () => {
        return shipStatus[0];
    },

    getInWordStatus: () => {
        return shipStatus[1];
    },

    getNotInWordStatus: () =>{
        return shipStatus[2];
    }


}
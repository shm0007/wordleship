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
    }
}
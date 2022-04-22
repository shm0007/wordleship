export const Ship = {

    toString: (ship) => {
        let word = "";
        for(let i = 0; i < ship.length; i++ ) {
            word += ship[i]['letter'];
        }
        return word;
    },

    dump: (ship) => {
        console.log(ship);
    }
}
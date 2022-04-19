const fiveLetterJson = require("../5-letter-words.json");
const sixLetterJson = require("../5-letter-words.json");
const sevenLetterJson = require("../5-letter-words.json");

class Validator{
    dict = new Set();
    constructor(){
        fiveLetterJson.forEach(word => {
            this.dict.add(word);
        });
        sixLetterJson.forEach(word => {
            this.dict.add(word);
        });
        sevenLetterJson.forEach(word => {
            this.dict.add(word);
        });
        

    }

    validate(word){
       
        if(this.dict.has(word))
            return true;
        else
            return false;
    }

}
export default new Validator();
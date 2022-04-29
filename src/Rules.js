import React from "react";

class Rules extends React.Component {

    render() {
        return (
            <div Style="margin-top: 2em; padding: 2em">
                <h1>Da Rules:</h1>
                <ul>
                    <li>Players will take turns placing ships of various lengths onto a 10x10 grid. Once all tiles are placed, two players will take turns attacking 
                        each other's ships.
                    </li>
                    <li>Attacks are done by placing words on the board in a readable format (left to right, or up/down). There will be no "eht" to sneakily hide "the" on the board. Also implementing that would've been a nightmare.</li>
                    <li>You can more easily navigate the grid by pressing "tab" or "Enter" like navigating a spreadsheet. Or by clicking a cell.</li>
                    <li>Words you can attack with can be as long as 7 letters, and as little as 2.</li>
                    <li>The board will light up in different colors depending on what what tile you hit and what letter you hit a tile with.</li>
                    <ul>
                        <li>
                            <span Style="color: grey;">Grey</span> means that you have hit a ship, but the letter you hit that tile with does not belong to the ship you just hit.
                        </li>
                        <li>
                            <span Style="color: yellow">Yellow</span> means you have hit a ship AND the letter you hit that tile with IS in the ship.
                        </li>
                        <li>
                            <span Style="color: green">Green</span> means you have hit the ship AND you hit the correct spot. Sound familiar yet?
                        </li>
                        <li>Ships will not sink unless you correctly guess the word, meaning the entire ship must be lit up green.</li>
                    </ul>
                    <li>The game is won when all ships are sunk.</li>
                </ul>
            </div>
        )
    }
}

export default Rules;
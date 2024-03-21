This project is done by Shamim Ehsan, Trevor Houck and Mike Way for partial fulfilment of the Grad course "CS-5332 Advance Computer Security" at the University of Minnesota Duluth

## Overview and Objective:

Battleshiporle / Wordleship  is a variant of Battleship, where each ship will consist of actual English words. It's a two player game played out over two phases- setup phase and attack phase. In setup phase- players will take turns placing ships of various lengths onto a 10x10 grid. Once all tiles are placed, the setup phase is ended.
In the Attack phase, players will take turns attacking each other's ships.

- Attacks are done by placing words on the board in a readable format (left to right, or up/down). There will be no "eht" to sneakily hide "the" on the board. Also implementing that would've been a nightmare.
- You can more easily navigate the grid by pressing "tab" or "Enter" like navigating a spreadsheet. Or by clicking a cell.
- Words you can attack with can be as long as 7 letters, and as little as 2.
- The board will light up in different colors depending on what tile you hit and what letter you hit a tile with.
- Grey means that you have hit a ship, but the letter you hit that tile with does not belong to the ship you just hit.
- Yellow means you have hit a ship AND the letter you hit that tile with IS in the ship.
- Green means you have hit the ship AND you hit the correct spot. Sound familiar yet?
- Ships will not sink unless you correctly guess the word, meaning the entire ship must be lit up green.
- The game is won when all ships are sunk.

## Live Demo
~~https://battleshipordle.herokuapp.com~~  ( Since Heroku stopped their free trial, our live demo also shuts down :( )



Set a match ID (Any positive integer) and select either Player0 / Player1
If both player enters the same match Id, the game will start.


## Installation Guide

In the project directory, run the following commands:

To start the express server:
### `npm run serve` 


Then, to run the react webapp locally, run: 
### `npm run start-local`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


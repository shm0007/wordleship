This project is done by Trevor Houck, Shamim Ehsan and Mike Way for partial fulfilment of the Grad course "CS-5332 Advance Computer Security" at the University of Minnesota Duluth

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

https://battleshipordle.herokuapp.com/

Set a match ID (Any positive integer) and select either Player0 / Player1
If both player enters the same match Id, the game will start.


## Installation Guide

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

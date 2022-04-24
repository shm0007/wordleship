import { Client } from 'boardgame.io/react';
import { Battleshipordle } from './Battleshipordle';
import Board from './BattleshipordleBoard';
import { SocketIO } from 'boardgame.io/multiplayer'

const App = Client({
  game: Battleshipordle,
  board: Board,
  //multiplayer: SocketIO({ server: 'localhost:8000' }), // Needed for multiplayer
});

export default App;
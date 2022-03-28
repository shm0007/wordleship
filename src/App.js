import { Client } from 'boardgame.io/react';
import { Battleshipordle } from './Battleshipordle';
import Board from './BattleshipordleBoard';

const App = Client({
  game: Battleshipordle,
  board: Board,
});

export default App;
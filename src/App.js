import { Client } from 'boardgame.io/react';
import { Battleshipordle } from './Battleshipordle'
import { BattleshipordleBoard } from './BattleshipordleBoard';


const App = Client({ 
  game: Battleshipordle,
  board: BattleshipordleBoard
});

export default App;

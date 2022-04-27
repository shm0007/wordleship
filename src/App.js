import React from 'react';
import { Client } from 'boardgame.io/react';
import { Battleshipordle } from './Battleshipordle';
import Board from './BattleshipordleBoard';
import { SocketIO } from 'boardgame.io/multiplayer'

const BattleshipordleClient = Client({
  game: Battleshipordle,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }), // Needed for multiplayer
  // debug: false,
});

class App extends React.Component {
  state = { playerID: null };

  render() {
    if(this.state.playerID === null) {
      return (
        <div>
          <p>Play as</p>
          <button onClick={() => this.setState({ playerID: "0" })}>
            Player 0
          </button>
          <button onClick={() => this.setState({ playerID: "1" })}>
            Player 1
          </button>
        </div>
      )
    }
    
    return (
      <div>
        <BattleshipordleClient playerID={this.state.playerID} />
      </div>
    );
  }
}

export default App;
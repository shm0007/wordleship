import React from 'react';
import { Client } from 'boardgame.io/react';
import { Battleshipordle } from './Battleshipordle';
import Board from './BattleshipordleBoard';
import { SocketIO } from 'boardgame.io/multiplayer'

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;

const BattleshipordleClient = Client({
  game: Battleshipordle,
  board: Board,
  multiplayer: SocketIO({ server }), // Needed for multiplayer
  // debug: false,
});

class App extends React.Component {
  state = { 
    playerID: null, 
    matchID: null
  };


  render() {
    if(this.state.playerID === null) {
      return (
        <div>
          <div>
            <p>MatchID: </p>
            <input type="number" id="matchID"></input>
            <button onClick={() => this.setState({matchID: document.getElementById('matchID').value })}>Set Match ID</button>
          </div>
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
        <BattleshipordleClient playerID={this.state.playerID} matchID={this.state.matchID} />
      </div>
    );
  }
}

export default App;
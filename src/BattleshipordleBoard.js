import React from 'react';
import PropTypes from 'prop-types';
import './board.css';
import { Ship } from './Ship';
import Rules from './Rules';

class Board extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  constructor(props) {
    super(props); 
    this.state = {
      focusedCell: null,
      visibleBoard: 0
    }
  };

  onClick = id => {
    if (this.isActive(id)) {
      this.setState({ focusedCell: id })
      window.addEventListener('keydown', this.keydown)
    }
  };

  //TODO: Change cell color if its been tampered with in the current turn.
  keydown = e => {
    const key = e.key.toLowerCase();

    const isLetter = /^[a-z]$/i.test(key)

    if(this.state.focusedCell !== null && isLetter) {
      this.props.moves.insertLetter(this.boardToRender(), this.state.focusedCell, key);
    }
    if(key === "backspace") {
      this.props.moves.clearLetter(this.state.focusedCell);
    }

    if(key === "tab") {
      
      this.setState({
        focusedCell: this.state.focusedCell + 1
      })
    }

    if(key === "enter") {
      this.setState({
        focusedCell: this.state.focusedCell + 10
      })
    }
  }

  isActive(id) {
    if (!this.props.isActive) return false;
    return true;
  }

  isFocusedCell(id) {
    return this.state.focusedCell === id;
  }

  boardToRender() {
    if(this.props.ctx.phase === "setup") {
      return this.props.playerID;
    }
    return this.props.ctx.currentPlayer === "1" ? 0 : 1;
  }

  render() {

    let winner = null;
    if (this.props.ctx.gameover) {
      if(this.props.ctx.gameover.winner !== undefined) {
        winner = (<h1 id="winner" Style="margin: auto">Player {this.props.ctx.gameover.winner} Wins!</h1>)
      } 
      else {
        winner = (<div id="winner">Draw!</div>)
      }
    }

    let submitAttackButton = (<button onClick={() => this.props.moves.submitAttack()}>Attack!</button>)
    let resetBoardButton = (<button onClick={() => this.props.moves.resetBoard(this.boardToRender())}>Reset Board</button>)
    let placeShipButton = (<button onClick={() => this.props.moves.placeShip()}>Place Ship</button>)

    return (
      <div className="board-main">
        <div className="match">
          Match #{this.props.matchID}
        </div>
        <h1 className="turn" Style="text-align: center">
          It is Player {this.props.ctx.currentPlayer}'s turn
        </h1>
        <h2 className="instruction" Style="text-align: center">
          {this.props.G.current_instruction}
        </h2>
        <div className='table-wrapper'>
          <div className="player-board-title">
            Player {this.boardToRender()}'s board
          </div>
          <table id="board">
            <tbody>{this.renderBoard()}</tbody>
          </table>
          <div className="player">
            You are Player {this.props.playerID ? this.props.playerID : 'N/A'}
          </div>
          {winner}
        </div>
        <div className="button-options">
          {this.props.ctx.phase ==="setup" ? placeShipButton : ''}
          {this.props.ctx.phase ==="attack" ? submitAttackButton : ''}
          {resetBoardButton}
        </div>
        <Rules />
      </div>
    );
  }

  renderBoard() {
    let tbody = [];
    for (let i = 0; i < 10; i++) {
      let cells = [];
      for (let j = 0; j < 10; j++) {

        const id = 10 * i + j;
        cells.push(this.renderCell(id));
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }
    return tbody;
  }

  renderCell(id) {

    let classnames = "";

    if(this.isActive(id)) {
      classnames += "active";
    }

    if(this.isFocusedCell(id)) {
      classnames += " focused";
    }

    let shipCell = Ship.cellPartofShip(this.props.G, this.boardToRender(), id)
    let renderAsShip = false;
    let renderShipLetter = false;
    if(shipCell !== false) {
      
      if(Ship.shouldBeRendered(this.props.playerID, this.boardToRender(), shipCell)) {

        // console.log(`cell ${id} will be rendered as a ship`);
        renderAsShip = true;
        if(this.boardToRender() == this.props.playerID) {
          renderShipLetter = true;
        }
        
        classnames += " ship" + " " + shipCell.status;
      }
    }
    return (
      <td
        key={id}
        className={classnames}
        onClick={() => this.onClick(id)}
      >
        { renderShipLetter ? shipCell.letter : this.props.G.board[this.boardToRender()][id]['letter'] }
      </td>
    )
  }
}

export default Board;
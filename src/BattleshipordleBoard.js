import React from 'react';
import PropTypes from 'prop-types';
import './board.css';
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
    console.log(key);

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
      return 0; //TODO: Change this to be dynamic to the player
    }
    return this.props.ctx.currentPlayer === 1 ? 0 : 1;
  }



  render() {

    let tbody = [];
    for (let i = 0; i < 10; i++) {
      let cells = [];
      for (let j = 0; j < 10; j++) {
        const id = 10 * i + j;

        let classnames = "";

        if(this.isActive(id)) {
          classnames += "active";
        }

        if(this.isFocusedCell(id)) {
          classnames += " focused";
        }

        cells.push(
          <td
            key={id}
            className={classnames}
            onClick={() => this.onClick(id)}
          >
            {this.props.G.board[this.boardToRender()][id]}
          </td>
        );
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }

    let winner = null;
    if (this.props.ctx.gameover) {
      if(this.props.ctx.gameover.winner !== undefined) {
        winner = (<div id="winner">Winner: {this.props.ctx.gameover.winner}</div>)
      } 
      else {
        winner = (<div id="winner">Draw!</div>)
      }
    }

    let submitAttackButton = (<button onClick={this.props.moves.submitAttack}>Attack!</button>)
    let resetBoardButton = (<button onClick={this.props.moves.resetBoard}>Reset Board</button>)
    let placeShipButton = (<button onClick={this.props.moves.placeShip}>Place Ship</button>)

    return (
      <div>
        rendered board: {this.boardToRender()}
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
        {winner}
        {this.props.ctx.phase ==="setup" ? placeShipButton : ''}
        {this.props.ctx.phase ==="attack" ? submitAttackButton : ''}
        {resetBoardButton}
      </div>
    );
  }
}

export default Board;
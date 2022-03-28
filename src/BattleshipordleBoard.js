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
      focusedCell: null
    }
  };


  onClick = id => {
    if (this.isActive(id)) {
      this.setState({ focusedCell: id })
      window.addEventListener('keydown', this.keydown)
    }
  };

  keydown = e => {
    const key = e.key.toLowerCase();
    console.log(key);

    const isLetter = /^[a-z]$/i.test(key)

    if(this.state.focusedCell !== null && isLetter) {
      this.props.moves.insertLetter(this.state.focusedCell, key);
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
            {this.props.G.cells[id]}
          </td>
        );
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }

    let winner = null;
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
            <div id="winner">Draw!</div>
          );
    }

    return (
      <div>
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
        {winner}
      </div>
    );
  }
}

export default Board;
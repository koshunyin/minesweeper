import React from 'react';
import Board from './Board';
import Counter from './Counter';
import Button from './Button';
import RadioGroup from './RadioGroup';
import './App.css';
const constants = require('../lib/constants');

export default class App extends React.Component {
  constructor(props) {
    super(props);



    this.state = {
      restart_count: 0,
      flag_count: 0,
      time: 0,
      button_status: constants.BUTTON_INIT,
      board_width: 30,
      board_height: 16,
      bomb_count: 99,
      difficulty: constants.DIFFICULTY_HARD
    };
  }

  handleSmileyClick = () => {
    this.restartGame();
  }

  restartGame = () => {
    // Force a restart
    this.setState({
      restart_count: this.state.restart_count + 1,
      flag_count: 0,
      time: 0,
      button_status: constants.BUTTON_INIT
    });

    clearInterval(this.timer);
  }

  handleTilePeek = (peek) => {
    let status = peek ? constants.BUTTON_PEEK : constants.BUTTON_INIT;
    this.setState({ button_status: status });
  }

  handleGameStatus = (status) => {
    // Game start
    if (status === constants.GAME_STATUS_START) {
      this.timer = setInterval(() => this.setState({
        time: this.state.time + 1
      }), 1000);
    }

    // Game end
    else {
      clearInterval(this.timer);
    }

    this.setState({ button_status: status });
  }

  handleFlagChange = (flagged) => {
    this.setState({ flag_count: this.state.flag_count + (flagged ? 1 : -1) });
  }

  handleRadioClick = (difficulty) => {
    let width, height, bombs;
    switch (difficulty) {
      case constants.DIFFICULTY_EASY:
        width = 9; height = 9; bombs = 10;
        break;
      case constants.DIFFICULTY_MEDIUM:
        width = 16; height = 16; bombs = 40;
        break;
      case constants.DIFFICULTY_HARD:
        width = 30; height = 16; bombs = 99;
        break;
      default: // Do Nothing
    }

    this.setState({
      board_width: width,
      board_height: height,
      bomb_count: bombs,
      difficulty: difficulty
    });

    this.restartGame();
  }

  render() {
    return (
      <div id='app' className='noselect'>
        <div className='centre'
          style={{ width: this.state.board_width * constants.TILE_HEIGHT, height: this.state.board_height * constants.TILE_HEIGHT }}
          onContextMenu={(e) => { e.preventDefault() }}
        >
          <h3 className='centre'>MineSweeper</h3>
          <div id='header'>
            <Counter value={this.state.bomb_count - this.state.flag_count} />
            <Button
              notifyClick={this.handleSmileyClick}
              status={this.state.button_status}
            ></Button>
            <Counter value={this.state.time} />
          </div>

          <Board
            key={this.state.restart_count} // Note: change in key will force restasrt
            board_width={this.state.board_width}
            board_height={this.state.board_height}
            bomb_count={this.state.bomb_count}
            notifyFlagChange={this.handleFlagChange}
            notifyGameStatus={this.handleGameStatus}
            notifyTilePeek={this.handleTilePeek}
          />
        </div>
        <RadioGroup
          difficulty={this.difficulty}
          notifyClick={this.handleRadioClick}
        ></RadioGroup>
      </div>
    );
  }
}

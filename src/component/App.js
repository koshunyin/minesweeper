import React from 'react';
import Board from './Board';
import Counter from './Counter';
import Button from './Button';
import Dropdown from './Dropdown';
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
    clearInterval(this.timer);
    this.setState({
      restart_count: this.state.restart_count + 1,
      flag_count: 0,
      time: 0,
      button_status: constants.BUTTON_INIT
    });
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

  handleDropdownChange = (difficulty) => {
    let my_width, height, bombs;

    switch (difficulty) {
      case constants.DIFFICULTY_EASY:
        my_width = 9; height = 9; bombs = 10;
        break;
      case constants.DIFFICULTY_MEDIUM:
        my_width = 16; height = 16; bombs = 40;
        break;
      case constants.DIFFICULTY_HARD:
        my_width = 30; height = 16; bombs = 99;
        break;
      default: // Do Nothing
    }

    this.setState({
      board_width: my_width,
      board_height: height,
      bomb_count: bombs,
      difficulty: difficulty
    });

    this.restartGame();
  }

  render() {
    return (
      <div id='app' className='noselect'>
        <h1 className='hide'>MineSweeper</h1>
        <h2 className='hide'>MineSweeper made from ReactJS</h2>
        <h3 className='hide'>Enjoy the classic MineSweeper</h3>
        <h4 className='hide'>Contact developer: koshunyin@gmail.com</h4>

        <Dropdown
          difficulty={this.state.difficulty}
          notifyChange={this.handleDropdownChange}
        ></Dropdown>
        <div
          style={{ width: this.state.board_width * constants.TILE_HEIGHT, height: this.state.board_height * constants.TILE_HEIGHT }}
          onContextMenu={(e) => { e.preventDefault() }}
        >
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
      </div>
    );
  }
}

import React from 'react';
import Board from './Board';
import Counter from './Counter';
import Button from './Button';
import './App.css';
const constants = require('../lib/constants');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.width = 30;
    this.height = 20;
    this.bomb_count = 99;

    this.state = {
      restart_count: 0,
      flag_count: 0,
      time: 0,
      button_status: constants.BUTTON_INIT
    };
  }

  handleSmileyClick = () => {
    // Force restart on Board
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

  render() {
    return (
      <div class='noselect'
        style={{ width: this.width * constants.TILE_HEIGHT, height: this.height * constants.TILE_HEIGHT }}
        onContextMenu={(e) => {e.preventDefault()}}
      >
        <div id='header'>
          <Counter value={this.bomb_count - this.state.flag_count} />
          <Button
            notifyClick={this.handleSmileyClick}
            status={this.state.button_status}
          ></Button>
          <Counter value={this.state.time} />
        </div>

        <Board
          key={this.state.restart_count} // Note: change in key will force restasrt
          board_width={this.width}
          board_height={this.height}
          bomb_count={this.bomb_count}
          notifyFlagChange={this.handleFlagChange}
          notifyGameStatus={this.handleGameStatus}
          notifyTilePeek={this.handleTilePeek}
        />
      </div>
    );
  }
}

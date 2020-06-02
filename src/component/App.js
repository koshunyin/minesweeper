import { Grid, Box } from '@material-ui/core';
import React from 'react';
import Board from './Board';
import Counter from './Counter';
import Button from './Button';
import Dropdown from './Dropdown';
import NumberInput from './NumberInput';
import './App.css';
const constants = require('../lib/constants');


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restart_count: 0,  // Note: change this  will force restasrt
      flag_count: 0,
      time: 0,
      button_status: constants.BUTTON_INIT,
      board_width: 30,
      board_height: 16,
      bomb_count: 99,
      mode: constants.MODE_HARD
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

  handleDropdownChange = (my_mode) => {
    let my_width, my_height, my_bombs;

    switch (my_mode) {
      case constants.MODE_EASY:
        my_width = 9; my_height = 9; my_bombs = 10;
        break;
      case constants.MODE_MEDIUM:
        my_width = 16; my_height = 16; my_bombs = 40;
        break;
      case constants.MODE_HARD:
        my_width = 30; my_height = 16; my_bombs = 99;
        break;
      default: // Do Nothing
    }

    this.setState({
      board_width: my_width,
      board_height: my_height,
      bomb_count: my_bombs,
      mode: my_mode
    });

    this.restartGame();
  }

  handleNumberInputChange = (obj) => {
    this.setState(obj);
    this.setState({mode: constants.MODE_CUSTOM});
    this.restartGame();
  }

  render() {
    return (
      <div id='app' className='noselect'>
        <h1 className='hide'>MineSweeper</h1>
        <h2 className='hide'>MineSweeper made from ReactJS</h2>
        <h3 className='hide'>Enjoy the classic MineSweeper</h3>
        <h4 className='hide'>Contact developer: koshunyin@gmail.com</h4>

        <Box mb={1}>
          <Grid
            container={true}
            direction='row'
            justify='flex-start'
            alignItems='flex-end'
          >
            <Box ml={1}>
              <Dropdown
                key={this.state.restart_count}
                mode={this.state.mode}
                notifyChange={this.handleDropdownChange}
              ></Dropdown>
            </Box>

            <Box ml={1}>
              <NumberInput
                key={this.state.restart_count}
                name='Width'
                value={this.state.board_width}
                min={constants.BOARD_WIDTH_MIN}
                max={constants.BOARD_WIDTH_MAX}
                notifyChange={(val) => { this.handleNumberInputChange({board_width: val})}}
              ></NumberInput>
            </Box>

            <Box ml={1}>
              <NumberInput
                key={this.state.restart_count}
                name='Height'
                value={this.state.board_height}
                min={constants.BOARD_HEIGHT_MIN}
                max={constants.BOARD_HEIGHT_MAX}
                notifyChange={(val) => { this.handleNumberInputChange({board_height: val})}}
              ></NumberInput>
            </Box>

            <Box ml={1}>
              <NumberInput
                key={this.state.restart_count}
                name='Bombs'
                value={this.state.bomb_count}
                min={1}
                max={this.state.board_width * this.state.board_height - 1} // Allow one non-bomb tile
                notifyChange={(val) => { this.handleNumberInputChange({bomb_count: val})}}
              ></NumberInput>
            </Box>
          </Grid>
        </Box>

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
            key={this.state.restart_count}
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

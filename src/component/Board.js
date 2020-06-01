import React from "react";
import Tile from './Tile';
import './Board.css';
const arr2D = require('../lib/arr2D');
const arrUtil = require('../lib/arrUtil');
const constants = require('../lib/constants');

export default class Board extends React.Component {
    constructor(props) {
        super(props);

        this.tile_value = arr2D.create(this.props.board_height, this.props.board_width, 0);
        this.non_bomb_tiles = this.props.board_width * this.props.board_height - this.props.bomb_count;
        this.state = {
            enabled: true,
            started: false,
            mouse_button: 0,
            peek: [],
            tile_state: arr2D.create(this.props.board_height, this.props.board_width, constants.TILE_STATE_INIT)
        };
    }

    // Make sure blank tile for first click (or non-bomb tile if too many bombs)
    populateBoard = (start_row, start_col) => {
        let arr;
        let min_non_bomb_tiles = 9;

        if (start_row === 0 || start_row === this.props.board_height - 1)
            min_non_bomb_tiles -= 3;

        if (start_row === 0 || start_row === this.props.board_width - 1)
            min_non_bomb_tiles -= 2;

        do {
            arr = arr2D.create(this.props.board_height, this.props.board_width, 0);
            arr = arr2D.populate(arr, constants.BOMB_VALUE, this.props.bomb_count);
            arr = arr2D.fillAdjCount(arr, constants.BOMB_VALUE);
        } while
            (
            (this.non_bomb_tiles >= min_non_bomb_tiles && arr[start_row][start_col] !== 0)
            || (this.non_bomb_tiles < min_non_bomb_tiles && arr[start_row][start_col] === constants.BOMB_VALUE)
        );

        this.tile_value = arr;

        this.setState({ started: true }, () => {
            this.props.notifyGameStatus(constants.GAME_STATUS_START);
            this.handleTileLeftClick(start_row, start_col);
        });
    }

    handleTileLeftClick = (row, col) => {
        // If not yet started, populate board
        if (!this.state.started) {
            this.populateBoard(row, col);
        }

        // If flagged or clicked, do nothing
        else if (this.state.tile_state[row][col] === constants.TILE_STATE_FLAGGED
            || this.state.tile_state[row][col] === constants.TILE_STATE_CLICKED) {
        }

        // If it's bomb, game over
        else if (this.tile_value[row][col] === constants.BOMB_VALUE) {
            this.setState({ tile_state: arr2D.update(this.state.tile_state, row, col, constants.TILE_STATE_RED_BOMB) });
            this.handleGameLose();
        }


        else {
            // Click the tile
            this.setState({ tile_state: arr2D.update(this.state.tile_state, row, col, constants.TILE_STATE_CLICKED) });

            // Check whether win
            if (arr2D.getCount(this.state.tile_state, constants.TILE_STATE_CLICKED) === this.non_bomb_tiles) {
                this.handleGameWin();
            }

            // If tile is zero, click adjacent non-bomb tiles
            else if (this.tile_value[row][col] === 0) {
                this.clickNonBombAdj(row, col);
            }
        }
    }

    // Toggle flag on tile if not clicked
    flagTile = (row, col) => {
        if (this.state.tile_state[row][col] !== constants.TILE_STATE_CLICKED) {
            let x;
            if (this.state.tile_state[row][col] === constants.TILE_STATE_FLAGGED)
                x = constants.TILE_STATE_INIT;
            else if (this.state.tile_state[row][col] === constants.TILE_STATE_INIT)
                x = constants.TILE_STATE_FLAGGED;

            this.setState({ tile_state: arr2D.update(this.state.tile_state, row, col, x) });
            this.props.notifyFlagChange(x === constants.TILE_STATE_INIT ? false : true);
        }
    }

    peekTile = (row, col, active) => {
        let id = this.getId(row, col);
        let arr = this.state.peek;
        if (active)
            arr.push(id);
        else
            arr = arrUtil.remove(arr, id);

        this.setState({ peek: arr });
        this.props.notifyTilePeek(active);
    }

    peekTileReset = () => {
        this.setState({ peek: [] });
        this.props.notifyTilePeek(false);
    }

    // If the tile's number equals surrounding flag count,
    // click the surrounding tiles
    HandleTileBothClick = (row, col) => {
        let adjBombCount = this.tile_value[row][col];

        if (adjBombCount > 0 && this.state.tile_state[row][col] === constants.TILE_STATE_CLICKED) {
            let flag_count = arr2D.getAdjCount(this.state.tile_state, row, col, constants.TILE_STATE_FLAGGED);
            if (flag_count === adjBombCount) {
                arr2D.callFnOnAdj(this.tile_value, row, col, this.handleTileLeftClick);
            }
        }
    }

    handleTileMouseEvent = (row, col, mouse_button, mouse_event) => {
        if (mouse_event === constants.MOUSE_ENTER) {
            switch (mouse_button) {
                case constants.MOUSE_LEFT:
                    this.peekTile(row, col, true);
                    break;
                case constants.MOUSE_BOTH:
                    arr2D.callFnOnAdj(this.tile_value, row, col, (i, j) => {
                        this.peekTile(i, j, true);
                    });
                    break;
                default: // Do Nothing
            }
        }
        else if (mouse_event === constants.MOUSE_LEAVE) {
            switch (mouse_button) {
                case constants.MOUSE_LEFT:
                    this.peekTile(row, col, false);
                    break;
                case constants.MOUSE_BOTH:
                    arr2D.callFnOnAdj(this.tile_value, row, col, (i, j) => {
                        this.peekTile(i, j, false);
                    });
                    break;
                default: // Do Nothing
            }
        }
        else if (mouse_event === constants.MOUSE_DOWN) {
            switch (mouse_button) {
                case constants.MOUSE_RIGHT:
                    this.flagTile(row, col);
                    break;
                case constants.MOUSE_LEFT:
                    this.peekTile(row, col, true);
                    break;
                case constants.MOUSE_BOTH:
                    arr2D.callFnOnAdj(this.tile_value, row, col, (i, j) => {
                        this.peekTile(i, j, true);
                    });
                    break;
                default: // Do Nothing
            }

            this.setState({ mouse_button: mouse_button });
        }
        else if (mouse_event === constants.MOUSE_UP) {
            this.peekTileReset();

            // Note: Mouse up's event_buttons is undefined
            switch (this.state.mouse_button) {
                case constants.MOUSE_LEFT:
                    this.handleTileLeftClick(row, col);
                    break;
                case constants.MOUSE_BOTH:
                    this.HandleTileBothClick(row, col);
                    break;
                default: // Do Nothing
            }

            // Reset mouse button
            this.setState({ mouse_button: 0 });
        }
    }

    // Click adjacent tile if it's non-clicked, non-flagged, non-bomb
    clickNonBombAdj = (row, col) => {
        arr2D.callFnOnAdj(this.tile_value, row, col, (i, j) => {
            if (i !== row || j !== col) {
                if (
                    this.state.tile_state[i][j] !== constants.TILE_STATE_CLICKED
                    && !this.state.tile_state[i][j] !== constants.TILE_STATE_FLAGGED
                    && this.tile_value[i][j] !== constants.BOMB_VALUE
                ) {
                    this.handleTileLeftClick(i, j);
                }
            }
        })
    }

    handleGameLose = () => {
        let new_tile_state = arr2D.map(this.state.tile_state, (arr, i, j) => {
            if (this.tile_value[i][j] === constants.BOMB_VALUE) {
                if (arr[i][j] !== constants.TILE_STATE_RED_BOMB && arr[i][j] !== constants.TILE_STATE_FLAGGED) {
                    arr[i][j] = constants.TILE_STATE_CLICKED;
                }
            }
            else if (arr[i][j] === constants.TILE_STATE_FLAGGED) {
                arr[i][j] = constants.TILE_STATE_NO_BOMB;
            }
        });

        this.setState({
            tile_state: new_tile_state,
            enabled: false
        });
        this.props.notifyGameStatus(constants.GAME_STATUS_LOSE);
    }

    // Flag all bomb tiles
    handleGameWin = () => {
        let new_tile_state = arr2D.map(this.state.tile_state, (arr, i, j) => {
            if (this.tile_value[i][j] === constants.BOMB_VALUE) {
                arr[i][j] = constants.TILE_STATE_FLAGGED;
            }
        });

        this.setState({
            tile_state: new_tile_state,
            enabled: false
        });
        this.props.notifyGameStatus(constants.GAME_STATUS_WIN);
    }

    getId = (row, col) => {
        return col + '_' + row;
    }

    render() {
        let arr = [];
        for (let row = 0; row < this.props.board_height; row++) {
            for (let col = 0; col < this.props.board_width; col++) {
                let id = this.getId(row, col);
                arr.push(<Tile
                    key={id}
                    peek={this.state.peek.includes(id)}
                    tile_value={this.tile_value[row][col]}
                    tile_state={this.state.tile_state[row][col]}
                    notifyMouseEvent={this.state.enabled ? this.handleTileMouseEvent : null}
                    row={row}
                    col={col}
                ></Tile>
                );
            }
        }

        return (
            <div
                className='comp_board'
                style={{ width: this.props.board_width * constants.TILE_HEIGHT, height: this.props.board_height * constants.TILE_HEIGHT }}
            >{arr}</div>
        );
    }
}
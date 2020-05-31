import React from "react";
import Tile from './Tile';
import './Board.css';
const arr2D = require('../lib/arr2D');
const arrUtil = require('../lib/arrUtil');
const constants = require('../lib/constants');

export default class Board extends React.Component {
    constructor(props) {
        super(props);

        this.board_value = arr2D.create(this.props.board_height, this.props.board_width, 0);
        this.non_bomb_tiles = this.props.board_width * this.props.board_height - this.props.bomb_count;
        this.state = {
            started: false,
            mouse_button: 0,
            peek: [],
            wrong_flag: [],
            board_wrong_bomb: '',
            board_clicked: arr2D.create(this.props.board_height, this.props.board_width, false),
            board_flagged: arr2D.create(this.props.board_height, this.props.board_width, false)
        };
    }

    // Make sure blank tile for first click (or non-bomb tile if too many bombs)
    populateBoard = (start_row, start_col) => {
        let arr;
        let min_non_bomb_tiles = 9;

        if(start_row === 0 || start_row === this.props.board_height - 1)
            min_non_bomb_tiles -= 3;
        
        if(start_row === 0 || start_row === this.props.board_width - 1)
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

        this.board_value = arr;

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
        else if (this.state.board_flagged[row][col] || this.state.board_clicked[row][col]) {
        }

        // If it's bomb, game over
        else if (this.board_value[row][col] === constants.BOMB_VALUE) {
            this.setState({ board_wrong_bomb: this.getId(row, col) });
            this.handleGameOver();
        }


        else {
            // Click the tile
            this.setState({ board_clicked: arr2D.update(this.state.board_clicked, row, col, true) });

            // Check whether win
            if (arr2D.getCount(this.state.board_clicked, true) === this.non_bomb_tiles) {
                this.handleGameWin();
            }

            // If tile is zero, click adjacent non-bomb tiles
            else if (this.board_value[row][col] === 0) {
                this.clickNonBombAdj(row, col);
            }
        }
    }

    // Toggle flag on tile if not clicked
    flagTile = (row, col) => {
        if (!this.state.board_clicked[row][col]) {
            this.setState({ board_flagged: arr2D.toggle(this.state.board_flagged, row, col) });
            this.props.notifyFlagChange(this.state.board_flagged[row][col]);
        }
    }

    peekTile = (row, col, active) => {
        let id = this.getId(row, col);
        let arr = this.state.peek;
        if (active)
            arr.push(id);    
        else
            arr = arrUtil.remove(arr, id);
            
        this.setState({peek: arr });
        this.props.notifyTilePeek(active);
    }

    peekTileReset = () => {
        this.setState({peek: []});
        this.props.notifyTilePeek(false);
    }

    // If the tile's number equals surrounding flag count,
    // click the surrounding tiles
    HandleTileBothClick = (row, col) => {
        let val = this.board_value[row][col];

        if (val > 0 && this.state.board_clicked[row][col] === true) {
            let flag_count = arr2D.getAdjCount(this.state.board_flagged, row, col, true);
            if (flag_count === val) {
                arr2D.callFnOnAdj(this.board_value, row, col, this.handleTileLeftClick);
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
                    arr2D.callFnOnAdj(this.board_value, row, col, (i, j) => {
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
                    arr2D.callFnOnAdj(this.board_value, row, col, (i, j) => {
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
                    arr2D.callFnOnAdj(this.board_value, row, col, (i, j) => {
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
        arr2D.callFnOnAdj(this.board_value, row, col, (i, j) => {
            if (i !== row || j !== col) {
                if (
                    !this.state.board_clicked[i][j]
                    && !this.state.board_flagged[i][j]
                    && this.board_value[i][j] !== constants.BOMB_VALUE
                ) {
                    this.handleTileLeftClick(i, j);
                }
            }
        })
    }

    handleGameOver = () => {
        let arr_clicked = this.state.board_clicked;
        let arr_wrong_flag = this.state.wrong_flag;

        for (let row = 0; row < this.props.board_height; row++) {
            for (let col = 0; col < this.props.board_width; col++) {
                if (this.board_value[row][col] === constants.BOMB_VALUE) {
                    // Click all the bombs
                    arr_clicked[row][col] = true;
                } else if (this.state.board_flagged[row][col] === true) {
                    // Mark wrong flag
                    arr_wrong_flag.push(this.getId(row, col));
                }
            }
        }

        this.setState({ board_clicked: arr_clicked });
        this.setState({ wrong_flag: arr_wrong_flag });
        this.props.notifyGameStatus(constants.GAME_STATUS_LOSE);
    }

    handleGameWin = () => {
        let arr = this.state.board_flagged;
        let n = arr.length;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (this.board_value[i][j] === constants.BOMB_VALUE) {
                    arr[i][j] = true;
                }
            }
        }

        this.setState({ board_flagged: arr });
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
                    wrong_bomb={(id === this.state.board_wrong_bomb)}
                    wrong_flag={this.state.wrong_flag.includes(id)}
                    peek={this.state.peek.includes(id)}
                    value={this.board_value[row][col]}
                    clicked={this.state.board_clicked[row][col]}
                    flagged={this.state.board_flagged[row][col]}
                    notifyMouseEvent={this.handleTileMouseEvent}
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
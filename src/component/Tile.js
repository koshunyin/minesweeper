import React from "react";
import './Tile.css';
const constants = require('../lib/constants');

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
    }

    handleMouseEvent = (e, mouse_event) => {
        if (this.props.notifyMouseEvent)
            this.props.notifyMouseEvent(this.props.row, this.props.col, e.buttons, mouse_event, e.ctrlKey);
    }

    handleTouchStart = () => {
        this.timer = setTimeout(() => {
            if (this.props.notifyLongTouchEvent)
                this.props.notifyLongTouchEvent(this.props.row, this.props.col);
        }, constants.LONG_TOUCH_DURATION);
    }

    handleTouchEnd = (e) => {
        clearTimeout(this.timer);
    }

    render() {
        let offset;
        switch (this.props.tile_state) {
            case constants.TILE_STATE_CLICKED:
                offset = (this.props.tile_value === constants.BOMB_VALUE ? constants.TILE_STATE_BOMB : this.props.tile_value);
                break;
            case constants.TILE_STATE_RED_BOMB:
            case constants.TILE_STATE_NO_BOMB:
            case constants.TILE_STATE_FLAGGED:
                offset = this.props.tile_state;
                break;
            default:
                if (this.props.peek) { offset = constants.TILE_STATE_PEEK; }
                else { offset = constants.TILE_STATE_INIT; }
        }

        return (
            <div
                className='comp-tile'
                style={{ backgroundPosition: '0px -' + offset * constants.TILE_HEIGHT + 'px' }}
                onMouseDown={(e) => this.handleMouseEvent(e, constants.MOUSE_DOWN)}
                onMouseUp={(e) => this.handleMouseEvent(e, constants.MOUSE_UP)}
                onMouseEnter={(e) => this.handleMouseEvent(e, constants.MOUSE_ENTER)}
                onMouseLeave={(e) => this.handleMouseEvent(e, constants.MOUSE_LEAVE)}
                onTouchStart={this.handleTouchStart}
                onTouchEnd={this.handleTouchEnd}
            ></div>
        );
    }
}
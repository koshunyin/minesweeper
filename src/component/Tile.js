import React from "react";
import './Tile.css';
const constants = require('../lib/constants');

export default class Tile extends React.Component {

    handleMouseEvent = (e, mouse_event) => {
        if (this.props.notifyMouseEvent)
            this.props.notifyMouseEvent(this.props.row, this.props.col, e.buttons, mouse_event);
    }

    render() {
        let className = [
            'comp-tile'
        ];

        let offset = constants.TILE_HEIGHT;
        if (this.props.wrong_bomb) { offset *= constants.TILE_OFFSET_BOMB_WRONG; }
        else if (this.props.wrong_flag) { offset *= constants.TILE_OFFSET_FLAG_WRONG; }
        else if (this.props.flagged) { offset *= constants.TILE_OFFSET_FLAG; }
        else if (this.props.clicked) { offset *= (this.props.value === constants.BOMB_VALUE ? constants.TILE_OFFSET_BOMB : this.props.value); }
        else if (this.props.peek) { offset *= constants.TILE_OFFSET_PEEK; }
        else { offset *= constants.TILE_OFFSET_INIT; }

        return (
            <div
                className={className.join(" ").trim()}
                style={{ backgroundPosition: '0px -' + offset + 'px' }}
                onMouseDown={(e) => this.handleMouseEvent(e, constants.MOUSE_DOWN)}
                onMouseUp={(e) => this.handleMouseEvent(e, constants.MOUSE_UP)}
                onMouseEnter={(e) => this.handleMouseEvent(e, constants.MOUSE_ENTER)}
                onMouseLeave={(e) => this.handleMouseEvent(e, constants.MOUSE_LEAVE)}
            ></div>
        );
    }
}
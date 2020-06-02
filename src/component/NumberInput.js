import { TextField, InputLabel } from '@material-ui/core';
import React from "react";

export default class NumberInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }

    handleLostFocus = (e) => {
        var numberPattern = /\d+/g;
        let val = e.target.value;
        val = (val.match(numberPattern) || []).join('');
        val = Math.max(val, this.props.min);
        val = Math.min(val, this.props.max);
        if (val !== this.props.value) {
            this.props.notifyChange(val);
            this.setState({ value: val });
        }
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <div className='comp-input'>
                <InputLabel htmlFor={this.props.name}>{this.props.name}</InputLabel>
                <TextField
                    id={this.props.name}
                    value={this.state.value}
                    onChange={this.handleChange}
                    onBlur={this.handleLostFocus}
                    inputProps={{ style: { textAlign: 'center', width: '3em' } }}
                ></TextField>
            </div>
        );
    }
}

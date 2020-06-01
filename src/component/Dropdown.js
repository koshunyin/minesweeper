import React from "react";
import './Dropdown.css';

export default class Dropdown extends React.Component {

    handleChange = (e) => {
        let val = parseInt(e.target.value);
        this.props.notifyChange(val);
    }

    render() {
        let arr = [];
        let difficulty = ['Easy', 'Medium', 'Hard'];
        for (let i = 0, n = difficulty.length; i < n; i++) {
            arr.push(
                <option
                    key={i}
                    value={i}
                >{difficulty[i]}</option>
            );
        }

        return (
            <select
                className='select-css'
                value={this.props.difficulty}
                onChange={this.handleChange}
            >
                {arr}
            </select>
        );
    }
}
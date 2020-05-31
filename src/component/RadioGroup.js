import React from "react";
import './RadioGroup.css';
const constants = require('../lib/constants');

export default class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: constants.DIFFICULTY_HARD
        };
    }

    handleClick = (val) => {
        this.props.notifyClick(val);
        this.setState({
            selectedOption: val
        })
    }

    handleOptionChange = (e) => {
        this.setState({
            selectedOption: e.target.value
        });
    };

    render() {
        let arr = [];
        let difficulty = ['Easy', 'Medium', 'Hard'];
        for (let i = 0, n = difficulty.length; i < n; i++) {
            arr.push(
                <span key={'span' + i}>
                    <input
                        key={i}
                        id={'radio' + i}
                        type='radio'
                        name='radios_difficulty'
                        value={i}
                        checked={i === this.state.selectedOption}
                        readOnly
                    ></input>
                    <label
                        key={'label' + i}
                        htmlFor={'radio' + i}
                        onClick={() => { this.handleClick(i) }}
                    >{difficulty[i]}</label>
                </span>
            );
        }


        return (
            <fieldset className='radio-group centre'>
                <legend>Difficulty</legend>
                {arr}
            </fieldset>
        );
    }
}
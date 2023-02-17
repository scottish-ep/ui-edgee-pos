import React, { Component } from 'react';

import {
	SquareRadioLabel,
	SquareInput,
	CustomSquareRadio,
	CheckIcon
} from './elements';

class SquareRadio extends Component {

	render() {
		return (
			<SquareRadioLabel>
				<span>{this.props.text}</span>
				<SquareInput 
				type="radio" 
				onChange={this.props.onChange.bind(this)} 
				name={this.props.name} 
				value={this.props.value} 
				defaultChecked={this.props.defaultChecked} 
				bg_color={this.props.bg_color}
				/>
				<CheckIcon className="fas fa-check" color={this.props.check_color}></CheckIcon>
				<CustomSquareRadio></CustomSquareRadio>
			</SquareRadioLabel>
		);
	}
}

export default SquareRadio;
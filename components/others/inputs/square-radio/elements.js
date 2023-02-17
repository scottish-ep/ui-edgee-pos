import styled from 'styled-components';

export const SquareRadioLabel = styled.label`
	display: block;
	position: relative;
	padding-left: 25px;
	margin-bottom: 12px;
	cursor: pointer;
	font-size: 15px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`;

/* Create a custom radio button */
export const CustomSquareRadio = styled.span`
	position: absolute;
	top: 0;
	left: 0;
	height: 18px;
	width: 18px;
	background-color: lightgrey;
	border-radius: 10%;
`;

export const CheckIcon = styled.i`
	visibility: hidden;
    position: absolute;
    left: 1.5px;
    top: 1.5px;
    z-index: 10;
	color: ${props => props.color};
`;

export const SquareInput = styled.input`
	position: absolute;
	opacity: 0;
	cursor: pointer;

	&:checked ~ ${CustomSquareRadio}{
		background-color: ${props => props.bg_color};
	}

	&:checked ~ ${CheckIcon}{
		visibility: visible;
	}
`;
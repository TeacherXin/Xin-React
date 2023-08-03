const surrpotSymbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ELEMENT_TYPE = surrpotSymbol
	? Symbol.for('react.element')
	: 0xeac7;

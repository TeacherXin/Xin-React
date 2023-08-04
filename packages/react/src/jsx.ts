import { REACT_ELEMENT_TYPE } from 'share/ReactSymbol';
import {
	Type,
	Ref,
	Key,
	Props,
	ElementType,
	ReactElementType
} from 'share/ReactType';
const ReactElement = function (
	type: Type,
	ref: Ref,
	key: Key,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		ref,
		key,
		props,
		__mark: 'Xin'
	};

	return element;
};

export const jsx = (
	type: ElementType,
	config: any,
	...maybeChldren: any
) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (const propName in config) {
		if (propName === 'key' && config[propName] !== undefined) {
			key = config[propName];
			continue;
		}
		if (propName === 'ref' && config[propName] !== undefined) {
			ref = config[propName];
			continue;
		}
		if ({}.hasOwnProperty.call(config, propName)) {
			props[propName] = config[propName];
		}
	}
	if (maybeChldren.length > 0) {
		if (maybeChldren.length === 1) {
			props.children = maybeChldren[0];
		} else {
			props.children = maybeChldren;
		}
	}
	return ReactElement(type, ref, key, props);
};

export const jsxDEV = (
	type: ElementType,
	config: any,
) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (const propName in config) {
		if (propName === 'key' && config[propName] !== undefined) {
			key = config[propName];
			continue;
		}
		if (propName === 'ref' && config[propName] !== undefined) {
			ref = config[propName];
			continue;
		}
		if ({}.hasOwnProperty.call(config, propName)) {
			props[propName] = config[propName];
		}
	}
	return ReactElement(type, ref, key, props);
};

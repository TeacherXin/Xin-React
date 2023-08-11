import { FilberNode } from './filber';
import { NoFlags, Update } from './filberFlags';
import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from './hostConfig';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';

function markUpdate(filber: FilberNode) {
	filber.flags |= Update;
}

/**
 * 构建离屏的DOM树
 * 标记Update Flags
 */
export const completeWork = (wip: FilberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponent: {
			if (current !== null && wip.stateNode !== null) {
				//更新
			} else {
				//构建DOM
				const instance = createInstance(wip.type, newProps);
				//将DOM插入到DOM树中
				// appendAllChildren(instance, wip);
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
				bubbleProperties(wip);
			}
			return null;
		}
		case HostText: {
			if (current !== null && wip.stateNode !== null) {
				//更新
				const oldText = current.memoizedProps.content;
				const newText = newProps.content;
				if (oldText !== newText) {
					markUpdate(wip);
				}
			} else {
				//构建DOM
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		}
		case HostRoot: {
			bubbleProperties(wip);
			return null;
		}
		case FunctionComponent: {
			bubbleProperties(wip);
			return null;
		}
		default: {
			console.error('错误的tag');
		}
	}
};

function appendAllChildren(parent: Element, wip: FilberNode) {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(wip: FilberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}

	wip.subtreeFlags |= subtreeFlags;
}

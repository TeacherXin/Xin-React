import { FilberNode } from './filber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';

let workInProgress: FilberNode | null = null;

function prepareFreshStack(filber: FilberNode) {
	workInProgress = filber;
}

function renderRoot(root: FilberNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (error) {
			console.error('执行错误');
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(filber: FilberNode) {
	const next = beginWork(filber);
	filber.memoizedProps = filber.pendingProps;

	if (next === null) {
		completeUnitOfWork(next);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(filber: FilberNode) {
	let node: FilberNode | null = filber;

	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
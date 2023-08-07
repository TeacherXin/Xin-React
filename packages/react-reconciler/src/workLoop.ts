import { createWorkInProgress, FilberNode, FilberRootNode } from './filber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTags';

let workInProgress: FilberNode | null = null;

function prepareFreshStack(root: FilberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFilber(filber: FilberNode) {
  const root = markUpdateFromFilberToRoot(filber)
  renderRoot(root)
}

function markUpdateFromFilberToRoot(filber: FilberNode) {
  let node = filber;
  let parent = filber.return;
  while(parent !== null){
    node = parent;
    parent = node.return;
  }
  if(node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}

function renderRoot(root: FilberRootNode) {
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
import { FilberNode, FilberRootNode } from './filber';
import { MutationMask, NoFlags, Placement } from './filberFlags';
import { appendChildToContainer, Container } from './hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FilberNode | null = null;
export const commitMutationEffects = (finishedWork: FilberNode) => {
	nextEffect = finishedWork;
	const child = nextEffect.child;
	if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
		nextEffect = child;
	} else {
		up: while (nextEffect !== null) {
			commitMutationEffectsOnFilber(nextEffect);
			const sibling: FilberNode | null = nextEffect.sibling;
			if (sibling !== null) {
				nextEffect = sibling;
				break up;
			}
			nextEffect = nextEffect.return;
		}
	}
};

function commitMutationEffectsOnFilber(finishedWork: FilberNode) {
	const flags = finishedWork.flags;
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
}

function commitPlacement(finishedWork: FilberNode) {
	console.error('执行placeMent');
	const hostParent = getHostParent(finishedWork);
	appendPlacementNodeIntoContainer(finishedWork, hostParent);
}

function getHostParent(filber: FilberNode) {
	let parent = filber.return;
	while (parent) {
		const parentTag = parent.tag;
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FilberRootNode).container;
		}
		parent = parent.return;
	}
	console.error('没找到对应的父节点');
}

function appendPlacementNodeIntoContainer(
	finishedWork: FilberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(finishedWork.stateNode, hostParent);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendChildToContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendChildToContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}

import { FilberNode, FilberRootNode } from './filber';
import { MutationMask, NoFlags, Placement } from './filberFlags';
import { appendChildToContainer, Container } from './hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FilberNode | null = null;
export const commitMutationEffects = (finishedWork: FilberNode) => {
	nextEffect = finishedWork;
	while (nextEffect !== null) {
		const child = nextEffect.child;
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
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
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
}

function getHostParent(filber: FilberNode): Container | null {
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
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FilberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}

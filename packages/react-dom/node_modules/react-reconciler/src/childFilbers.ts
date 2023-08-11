import { Props, ReactElementType } from 'share/ReactType';
import { createFilberFromElement, createWorkInProgress, FilberNode } from './filber';
import { REACT_ELEMENT_TYPE } from 'share/ReactSymbol';
import { HostText } from './workTags';
import { ChildDeletion, Placement } from './filberFlags';

function ChildReconciler(shouldTrackEffects: boolean) {

	function deleteChild(returnFilber: FilberNode, childToDelete: FilberNode){
		if(!shouldTrackEffects){
			return;
		}
		const deletions = returnFilber.deletions;
		if(deletions === null){
			returnFilber.deletions = [childToDelete];
			returnFilber.flags |= ChildDeletion
		}else {
			deletions.push(childToDelete)
		}
	}

	function reconcileSingleElement(
		returnFilber: FilberNode,
		currentFilber: FilberNode | null,
		element: ReactElementType
	) {
		if(currentFilber !== null){
			//更新
			if(element.key === currentFilber.key){
				if(element.$$typeof === REACT_ELEMENT_TYPE) {
					if(element.key === currentFilber.key){
						const existing = useFilber(currentFilber, element.props);
						existing.return = returnFilber;
						return existing
					}
					deleteChild(returnFilber, currentFilber)
				}else {
					console.error('为实现的react类型')
				}
			}else{
				deleteChild(returnFilber, currentFilber)
			}
		}

		const filber = createFilberFromElement(element);
		filber.return = returnFilber;
		return filber;
	}

	function reconcileSingleTextNode(
		returnFilber: FilberNode,
		currentFilber: FilberNode | null,
		content: string | number
	) {
		if(currentFilber !== null){
			//update
			if(currentFilber.tag === HostText){
				const existing = useFilber(currentFilber, {content});
				existing.return = returnFilber;
				return existing
			}
			deleteChild(returnFilber, currentFilber)
		}
		const filber = new FilberNode(HostText, { content }, null);
		filber.return = returnFilber;
		return filber;
	}

	function placeSingleChild(filber: FilberNode) {
		if (shouldTrackEffects && filber.alternate === null) {
			filber.flags |= Placement;
		}
		return filber;
	}

	return function reconcileChildFilbers(
		returnFilber: FilberNode,
		currentFilber: FilberNode | null,
		newChild?: ReactElementType
	) {
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE: {
					return placeSingleChild(
						reconcileSingleElement(returnFilber, currentFilber, newChild)
					);
				}
				default: {
					console.error('错误的type');
				}
			}
		}
		//TDDO 多节点的情况

		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFilber, currentFilber, newChild)
			);
		}

		if(currentFilber !== null){
			//兜底删除
			deleteChild(returnFilber, currentFilber)
		}

		console.error('错误的element');
		return null;
	};
}

function useFilber(filber: FilberNode, pendingProps: Props): FilberNode {
	const clone = createWorkInProgress(filber, pendingProps);
	clone.index = 0;
	clone.sibling = null;
	return clone
}

export const reconcileChildFilbers = ChildReconciler(true);
export const mountChildFilbers = ChildReconciler(false);

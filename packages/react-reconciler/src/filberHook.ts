import { FilberNode } from './filber';
import internals from 'share/internals'

let currentlyRenderingFilber: FilberNode | null = null;
let workInProgressHook: Hook | null = null;
const {currentDispatcher} = internals;

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null
}

export function renderWithHooks(wip: FilberNode) {

	currentlyRenderingFilber = wip;
	wip.memoizedState = null;

	const current = wip.alternate;
	if(current !== null){
		//更新
	}else{
		//mount
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	currentlyRenderingFilber = null;

	return children;
}

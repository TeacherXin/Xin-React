import { FilberNode } from './filber';
import internals from 'share/internals';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from './updateQueue'
import { Action } from 'share/ReactType';
import { scheduleUpdateOnFilber } from './workLoop';

let currentlyRenderingFilber: FilberNode | null = null;
let workInProgressHook: Hook | null = null;
const { currentDispatcher } = internals;

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FilberNode) {
	currentlyRenderingFilber = wip;
	wip.memoizedState = null;

	const current = wip.alternate;
	if (current !== null) {
		//更新
	} else {
		//mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	currentlyRenderingFilber = null;

	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
}

function mountState<State>( initialState: State | (() => State)): [State, Dispatch<State>] {
	const hook = mountWorkInProgressHook();
	let memoizedState;
	if(initialState instanceof Function){
		memoizedState = initialState()
	}else{
		memoizedState = initialState
	}
	const queue = createUpdateQueue();
	hook.updateQueue = queue;

	const dispatch = dispatchSetState.bind(null,currentlyRenderingFilber, queue)
	queue.dispath = dispatch;
	return [memoizedState, dispatch]
}

function dispatchSetState <State>(filber: FilberNode, updateQueue: UpdateQueue<State>, action: Action<State>) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFilber(filber)
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next : null
	}
	if(workInProgressHook === null){
		if(currentlyRenderingFilber === null){
			throw new Error('hook只能在函数组件使用')
		}else{
			workInProgressHook = hook;
			currentlyRenderingFilber.memoizedState = workInProgressHook;
		}
	}else{
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}

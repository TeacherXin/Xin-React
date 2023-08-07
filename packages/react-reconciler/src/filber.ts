import { Props, Key, Ref } from 'share/ReactType';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './filberFlags';
import { Container } from './hostConfig';

export class FilberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	type: any;

	return: FilberNode | null;
	sibling: FilberNode | null;
	child: FilberNode | null;
	index: number;

	ref: Ref;

	pendingProps: Props;
	memoizedProps: Props | null;
  memoizedState: any;
  updateQueue: unknown;

	alternate: FilberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		this.type = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
    this.memoizedState = null;
		this.alternate = null;

		this.flags = NoFlags;
    this.updateQueue = null;
	}
}

export class FilberRootNode {
  container: Container;
  current: FilberNode;
  //递归完成后的hostRootFilber
  finishedWork: FilberNode | null;
  constructor (container: Container, hostRootFilber: FilberNode) {
    this.container = container;
    this.current = hostRootFilber;
    hostRootFilber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWorkInProgress = (current: FilberNode, pendingProps: Props): FilberNode => {
  let wip = current.alternate;

  if(wip === null){
    wip = new FilberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current.alternate;
    current.alternate = wip;
  }else{
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  return wip
}
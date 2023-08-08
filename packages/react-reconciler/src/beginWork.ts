import { ReactElementType } from 'share/ReactType';
import { mountChildFilbers,reconcileChildFilbers } from './childFilbers';
import { FilberNode } from './filber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

export const beginWork = (wip: FilberNode) => {
  switch (wip.tag) {
    case HostRoot: {
      return updateHostRoot(wip);
    }
    case HostComponent: {
      return updateHostComponent(wip);
    }
    case HostText: {
      return null;
    }
    default: {
      console.error('错误的tag')
    }
    return null;
  }
};

/**
 * 计算状态的最新值
 * 创造子filberNode
 */
function updateHostRoot(wip: FilberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending)

  wip.memoizedProps = memoizedState;
  //对应子FilberNode的ReactElement
  const nextChildren = wip.memoizedProps;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * 创造子filberNode
 */
function updateHostComponent(wip: FilberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip: FilberNode, children?: ReactElementType) {
  const current = wip.alternate;
  if(current !== null ){
    wip.child = reconcileChildFilbers(wip, current?.child, children)
  }else {
    wip.child = mountChildFilbers(wip, null, children)
  }
}

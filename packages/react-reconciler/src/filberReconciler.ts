import { ReactElementType } from 'share/ReactType';
import { FilberNode, FilberRootNode } from './filber';
import { Container } from './hostConfig';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFilber } from './workLoop';
import { HostRoot } from './workTags';

//ReactDom.createRoot(rootElement)触发
export function createContainer(container: Container) {
	const hostRootFilber = new FilberNode(HostRoot, {}, null);
	/**
	 * root:{
	 * 	container: div #root
	 * 	current: 对应的最外层的FilberNode |-> stateNode指回root
	 * }
	 */
	const root = new FilberRootNode(container, hostRootFilber);
	/**
	 * updateQueue： {
	 * 	shared: {
	 * 		pending: 更新的内容
	 * 	}
	 * }
	 */
	hostRootFilber.updateQueue = createUpdateQueue();
	return root;
}

//ReactDom.createRoot().render(<App />)触发
export function updateContainer(
	element: ReactElementType,
	root: FilberRootNode
) {
	//最外层filber
	const hostRootFilber = root.current;
	/**
	 * update: {
	 * 	action: reactElement(由于是最外层，所以更新的内容就是<App />的React元素)
	 * }
	 */
	const update = createUpdate<ReactElementType | null>(element);
	//将update放在hostRootFilber的更新队列updateQueue里面
	enqueueUpdate(
		hostRootFilber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	//进入workLoop循环
	scheduleUpdateOnFilber(hostRootFilber);
	return element;
}

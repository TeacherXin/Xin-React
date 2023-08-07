import { ReactElementType } from "share/ReactType";
import { FilberNode, FilberRootNode } from "./filber";
import { Container } from "./hostConfig";
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from "./updateQueue";
import { scheduleUpdateOnFilber } from "./workLoop";
import { HostRoot } from "./workTags";

//ReactDom.createRoot(rootElement)触发
export function createContainer(container: Container) {
  const hostRootFilber = new FilberNode(HostRoot, {}, null);
  const root = new FilberRootNode(container, hostRootFilber);
  hostRootFilber.updateQueue = createUpdateQueue();
  return root;
}

//ReactDom.createRoot().render(<App />)触发
export function updateContainer(element: ReactElementType, root: FilberRootNode) {
  const hostRootFilber = root.current;
  const update = createUpdate<ReactElementType | null>(element);
  enqueueUpdate(hostRootFilber.updateQueue as UpdateQueue<ReactElementType | null>, update);
  scheduleUpdateOnFilber(hostRootFilber)
  return element
}
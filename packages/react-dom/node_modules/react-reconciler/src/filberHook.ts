import { FilberNode } from "./filber";

export function renderWithHooks(wip: FilberNode) {
  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  return children;
}
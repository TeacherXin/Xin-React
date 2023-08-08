import { ReactElementType } from "share/ReactType";
import { createFilberFromElement, FilberNode } from "./filber";
import { REACT_ELEMENT_TYPE } from "share/ReactSymbol";
import { HostText } from "./workTags";
import { Placement } from "./filberFlags";



function ChildReconciler(shouldTrackEffects: boolean) {

  function reconcileSingleElement(returnFilber: FilberNode, currentFilber: FilberNode | null, element: ReactElementType) {
    const filber = createFilberFromElement(element);
    filber.return = returnFilber;
    return filber
  }

  function reconcileSingleTextNode(returnFilber: FilberNode, currentFilber: FilberNode | null, content: string | number) {
    const filber = new FilberNode(HostText, { content }, null);
    filber.return = returnFilber;
    return filber
  }

  function placeSingleChild(filber: FilberNode) {
    if(shouldTrackEffects && filber.alternate === null){
      filber.flags |= Placement
    }
    return filber;
  }

  return function reconcileChildFilbers(returnFilber: FilberNode, currentFilber: FilberNode | null, newChild?: ReactElementType) {
    if(typeof newChild === 'object' && newChild !== null){
      switch (newChild.$$typeof){
        case REACT_ELEMENT_TYPE: {
          return placeSingleChild(reconcileSingleElement(returnFilber, currentFilber, newChild));
        }
        default : {
          console.error('错误的type')
        }
      }
    }
    //TDDO 多节点的情况

    if(typeof newChild === 'string' || typeof newChild === 'number'){
      return placeSingleChild(reconcileSingleTextNode(returnFilber,currentFilber,newChild));
    }

    console.error('错误的element')
    return null;
  }
}

export const reconcileChildFilbers = ChildReconciler(true);
export const mountChildFilbers = ChildReconciler(false);
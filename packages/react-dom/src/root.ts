import { Container } from "react-reconciler/src/hostConfig";
import { createContainer, updateContainer } from "react-reconciler/src/filberReconciler"
import { ReactElementType } from 'share/ReactType'
export function createRoot(container: Container) {
  const root = createContainer(container);

  return {
    render(element: ReactElementType){
      updateContainer(element, root)
    }
  }
}
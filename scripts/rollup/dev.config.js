import reactDomConfg from "./react-dom.config";
import reactConfg from './react.config'

export default () => {
  return [...reactDomConfg, ...reactConfg]
}
import {
    DefaultNodeModel,
    LinkModel,
    NodeModel,
} from '@projectstorm/react-diagrams'
import { Editor } from './components/Editor'

export function processNode (node: Element, content: string = '') {
    const nodeTopDiv = node.firstElementChild?.firstElementChild as HTMLElement
    nodeTopDiv.style.height = '200px'
    nodeTopDiv.style.width = '150px'

    ReactDOM.render(
        <Editor>
            {content}
        </Editor>,
        nodeTopDiv
    )
}

import {
  DefaultNodeModel,
  LinkModel,
  NodeModel
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

const languages = {
  org: 'orgmode'
}

function getLanguage (ext, defaultValue) {
  return languages[ext] || defaultValue
}

export async function createGraph (file, engine, model) {
  const extension = file.name.match(/\.(.+)$/)?.[1]
  const language = getLanguage(extension, 'orgmode')
  const text = await file.text()
  const matches = [text] // $DPS text.matchAll(/pattern/)

  const nodes: NodeModel[] = []
  const nodesData = matches.map(content => {
    const node = new DefaultNodeModel()
    node.addInPort('In')
    node.addOutPort('Out')
    nodes.push(node)
    return {
      id: node.getOptions().id,
      content
    }
  })

  model.addAll(...nodes)
  await engine.repaintCanvas(true)

  nodesData.forEach(data => {
    const nodeElement = document.querySelector(`.node[data-nodeid="${data.id}"]`)
    if (nodeElement) processNode(nodeElement, data.content)
  })
}

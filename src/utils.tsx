import {
  DefaultNodeModel,
  LinkModel,
  NodeModel,
  DiagramModel,
  DiagramEngine,
  DagreEngine
} from '@projectstorm/react-diagrams'
import { Editor } from './components/Editor'

const dagreEngine = new DagreEngine({
	  graph: {
	      rankdir: 'RL',
	      ranker: 'longest-path',
	      marginx: 25,
	      marginy: 25
	  },
	  includeLinks: true
})

const languages = {
  org: 'orgmode'
}

const patterns = {
  orgmode: /pattern/
}

interface NodeOptions {
    height?: number,
    width?: number,
}

export function processNode (node: Element, content: string = '', options: NodeOptions = { height: 200, width: 150 }) {
  const nodeTopDiv = node.firstElementChild?.firstElementChild as HTMLElement
  nodeTopDiv.style.height = options.height + 'px'
  nodeTopDiv.style.width = options.width + 'px'

  ReactDOM.render(
        <Editor>
            {content}
        </Editor>,
        nodeTopDiv
  )
}

function getLanguage (extension, defaultValue) {
  return languages[extension] || defaultValue
}

function getPattern (language) {
  return patterns[language]
}

function parseText (text, language): string[] {
  if (true) {
    return [text]
  } else {
    /* return text.matchAll(getPattern(language)) */
  }
}

export async function createGraph (file, engine: DiagramEngine, model: DiagramModel) {
  const extension = file.name.match(/\.(.+)$/)?.[1]
  const language = getLanguage(extension, 'orgmode')
  const text = await file.text()
  const matches = parseText(text, language)

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

  dagreEngine.redistribute(model)
  engine.zoomToFitNodes(50)
}

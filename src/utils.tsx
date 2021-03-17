import {
  DefaultNodeModel,
  LinkModel,
  NodeModel,
  PointModel,
  DefaultLinkModel,
  DiagramModel,
  DiagramEngine,
  DagreEngine
} from '@projectstorm/react-diagrams'
import { Editor } from './components/Editor'

const dagreEngine = new DagreEngine({
  graph: {
    rankdir: 'LR',
    ranker: 'tight-tree',
    marginx: 25,
    marginy: 25
  },
  includeLinks: true
})

const languages = {
  org: 'orgmode'
}

const patterns = {
  orgmode: /^\*{2} .*$/
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
  return patterns[language].source
}

function createLink (source, target) {
  const outPort = source.getPorts().Out
  const inPort = target.getPorts().In
  const link = new DefaultLinkModel()
  link.setSourcePort(outPort)
  link.setTargetPort(inPort)
  link.setPoints([
    new PointModel({
      link,
      position: outPort?.getPosition()
    }),
    new PointModel({
      link,
      position: inPort?.getPosition()
    })
  ])
  return link
}

function parseText (text, language): string[] {
  // lookahead is used to keep the delimiter in the match after splitting
  const pattern = new RegExp(`(?=${getPattern(language)})`, 'gm')
  const matches = text.split(pattern)
  return matches.filter(Boolean)
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

  const links: LinkModel[] = []
  nodes.forEach((node, idx) => {
    const nextNode = nodes[idx + 1]
    if (nextNode) links.push(createLink(node, nextNode))
  })

  model.addAll(...nodes, ...links)
  await engine.repaintCanvas(true)

  nodesData.forEach(data => {
    const nodeElement = document.querySelector(`.node[data-nodeid="${data.id}"]`)
    if (nodeElement) processNode(nodeElement, data.content)
  })

  setTimeout(() => {
    dagreEngine.redistribute(model)
    engine.zoomToFitNodes()
  })
}

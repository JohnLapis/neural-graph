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
  orgmode: {
    startContent: /^\*{2} .*$/,
    delimiter: /^\*{2} .*$/,
    metadata: new RegExp([
      /^#\+name: neural-graph metadata.*\n/,
      /#\+begin_src.*\n/,
      /((.|\n)*)\n/,
      /#\+end_src$/,
    ].map(r => r.source).join(''),
    'mi'),
    metadataDelims: {
      begin: [
        '#+name: neural-graph metadata',
        '#+begin_src YAML',
      ].join("\n"),
      end: '#+end_src',
    }
  }
}

interface NodeOptions {
    height?: number,
    width?: number,
}

function getLanguage (extension, defaultValue) {
  return languages[extension] || defaultValue
}

function getPatterns (language) {
  const pattern = patterns[language]
  return {
    delimiter: pattern.delimiter,
    startContent: pattern.startContent,
    metadata: pattern.metadata,
    metadataDelims: pattern.metadataDelims,
  }
}

function addRegexFlags (regex, newFlags) {
  const flags = Array.from(new Set(regex.flags + newFlags)).join('')
  return new RegExp(regex.source, flags)
}

function getContentLines(graph): string[] {
    // assuming ids always increase with when nodes are created and aren't
    // altered in a dumb and unpredictable way
    const nodes = graph.getModel().getNodes().sort((a, b)=> a.getId() < b.getId())
    return nodes
        .map(node => document.querySelector(`.node[data-nodeid="${node.id}"`))
        .map(el => el.firstElementChild.maisUmasParadas.innerText)
        .join('\n')
        .split('\n')
}

function getMetadata(graph) {
    const nodes = Object.entries(
        graph.layers.find(l => l.type == "diagram-nodes")?.models || {}
    )
    const edges = Object.values(
        graph.layers.find(l => l.type == "diagram-links")?.models || {}
    )
    return {
        nodes: nodes.map(n => ({id: n[0], name: n[1].name})),
        edges: edges.map(e => ({out: e.target, 'in': e.source})),
        // This field can only be edited by the user
        'no-edges': [],
    }
}

function convertMedatadaToFileFormat(metadata, language): string {
    const {begin, end} = getPatterns(language).metadataDelims
    return begin + JSON.stringify(metadata) + end // IMP
}

export function exportGraph(model){
    // rename those guys
    const graph = model.serialize()
    const metadata: string = convertMedatadaToFileFormat(
        getMetadata(graph), graph.language
    )
    let contentLines: string[] = getContentLines(graph)
    let startContent = getPatterns(graph.language).startContent
    const startContentLineNum = contentLines.findIndex(
        line => line.match(startContent)
    )
    const metadataLineNum = contentLines
      .slice(0, startContentLineNum) // Before start of content
       // Returns index of first empty line or of line before before content
      .findIndex(line => line.match(/^$/)) || startContentLineNum - 1
    contentLines.splice(metadataLineNum, 0, metadata + '\n')
    return contentLines.join('')
}

export function exportGraphToFile(file, ...args) {
    file.write(exportGraph(...args))
}

function readMetadata (metadata) {
  return JSON.parse(metadata)
}

function parseText (text, language) {
  // lookahead is used to keep the delimiter in the match after splitting
  const patterns = getPatterns(language)
  const metadata = text
    .match(addRegexFlags(patterns.metadata, 'm'))?.[1] || ''
  const textWithoutMetadata = text.replace(metadata, '')
  const delimPattern = addRegexFlags(patterns.delimiter, 'gm')
    // @ts-ignore
    window.ss = textWithoutMetadata
    window.sp = delimPattern
  const textChunks = textWithoutMetadata
    .trim()
    // delimiter remains in matches
    .split(new RegExp(`(?=${delimPattern.source})`, delimPattern.flags))
    .filter(Boolean)
  return { textChunks, metadata }
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

export async function createGraph (file, engine: DiagramEngine, model: DiagramModel) {
  const extension = file.name.match(/\.(.+)$/)?.[1]
  const language = getLanguage(extension, 'orgmode')
  const text = await file.text()
  const { textChunks, metadata: graphMetadata } = parseText(text, language)

  const nodes: NodeModel[] = []
  const nodesData = textChunks.map(content => {
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
  try {
      model.deserializeModel(readMetadata(graphMetadata), engine)
  } catch (err) {}
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

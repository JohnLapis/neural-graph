import createEngine, {
  DefaultNodeModel,
  DiagramModel,
  LinkModel,
  NodeModel,
  DagreEngine
} from '@projectstorm/react-diagrams'
import { GraphCanvas } from './components/GraphCanvas'
import { createGraph, processNode } from './utils'

function getTestModel() {
  const node1 = new DefaultNodeModel({ name: 'Node 1', color: 'rgb(0,192,255)' })
  node1.setPosition(100, 100)
  node1.addInPort('In')
  node1.addOutPort('Out')

  const node2 = new DefaultNodeModel({ name: 'Node 2', color: 'rgb(0,192,255)' })
  node2.setPosition(500, 100)
  node2.addInPort('In')
  node2.addOutPort('Out')

  const node3 = new DefaultNodeModel({ name: 'Node 3', color: 'rgb(0,192,255)' })
  node3.setPosition(500, 200)
  node3.addInPort('In')
  node3.addOutPort('Out')

  const model = new DiagramModel()
  model.addAll(node1, node2, node3)
  return model
}

const mockFile = {
    name: 'name',
    text: async () => `
** a

j;dj@$*3!$0_"'"

** b

fa;d

d;fl
** c
sadlfa

;fs
asd
** d
asdlfksad;f
    `,
}

const engine = createEngine()
const model = new DiagramModel() // getTestModel()
engine.setModel(model)
// @ts-ignore
window.E = engine
// @ts-ignore
window.r = (...args) => engine.repaintCanvas(...args)
// @ts-ignore
window.M = model
// @ts-ignore
window.D = new DagreEngine({
  graph: {
    rankdir: 'LR',
    ranker: 'tight-tree',
    marginx: 25,
    marginy: 25
  },
  includeLinks: true
})
setTimeout(() => createGraph(mockFile, engine, model))

export default function App () {
  return (
      <div className="vw-100 vh-100 mw-100 mh-100 grid container">
          <div className="row">
              <button onClick={async () => {
                const newNode = new DefaultNodeModel({ name: 'OIOIO' })
                newNode.addInPort('In')
                newNode.addOutPort('Out')
                model.addNode(newNode)
                await engine.repaintCanvas(true)
                const id = newNode.getOptions().id
                const nodeElement = document.querySelector(`.node[data-nodeid="${id}"]`)
                if (nodeElement) processNode(nodeElement)
              }}>
                  Add node
              </button>
              <button onClick={() => {
                if (model.getSelectedEntities().length === 1) {
                  const entity = model.getSelectedEntities()[0]
                  if (entity instanceof NodeModel) model.removeNode(entity)
                  engine.repaintCanvas()
                }
              }}>
                  Remove node
              </button>
              <button onClick={() => {
                if (model.getSelectedEntities().length === 1) {
                  const entity = model.getSelectedEntities()[0]
                  if (entity instanceof LinkModel) model.removeLink(entity)
                  engine.repaintCanvas()
                }
              }}>
                  Remove edge
              </button>
              <input type="file" onChange={async (e) => {
                const files = e.target.files || []
                if (files.length > 0) {
                  createGraph(files[0], engine, model)
                }
              }} />
          </div>
          <div className="row">
              <GraphCanvas engine={engine} />
          </div>
      </div>
  )
}

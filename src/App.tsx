import createEngine, {
  DefaultNodeModel,
  DiagramModel,
  LinkModel,
  NodeModel,
} from '@projectstorm/react-diagrams'
import { GraphCanvas } from './components/GraphCanvas'
import { processNode } from './utils'

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

const engine = createEngine()
const model = getTestModel()
engine.setModel(model)

export default function App () {
  return (
      <div className="vw-100 vh-100 grid container">
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
          </div>
          <div className="row">
              <GraphCanvas engine={engine} />
          </div>
      </div>
  )
}

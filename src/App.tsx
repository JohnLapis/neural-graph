import React from 'react'
import createEngine, {
  DefaultNodeModel,
  DiagramModel
} from '@projectstorm/react-diagrams'
import GraphCanvas from './components/GraphCanvas'

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

const engine = createEngine()
engine.setModel(model)

export default function App () {
  return (
      <div className="vw-100 vh-100 grid container">
          <div className="row">
              <button onClick={() => {
                const node3 = new DefaultNodeModel({ name: 'OIOIO' })
                model.addNode(node3)
                engine.repaintCanvas()
              }}>
                  Add node
              </button>
              <button onClick={() => {
                if (model.getSelectedEntities().length === 1) {
                  model.removeNode(model.getSelectedEntities()[0])
                  engine.repaintCanvas()
                }
              }}>
                  Remove node
              </button>
              <button onClick={() => {
                if (model.getSelectedEntities().length === 1) {
                  model.removeLink(model.getSelectedEntities()[0])
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

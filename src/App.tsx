import React from 'react'
import createEngine, {
  DefaultNodeModel,
  DiagramModel
} from '@projectstorm/react-diagrams'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import styled from '@emotion/styled'

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

class GraphCanvas extends CanvasWidget {
  componentDidMount () {
    this.canvasListener = this.props.engine.registerListener({
      repaintCanvas: () => {
        this.forceUpdate()
      }
    })
    this.keyDown = (event) => {
      this.props.engine.getActionEventBus().fireAction({ event })
    }
    this.keyUp = (event) => {
      this.props.engine.getActionEventBus().fireAction({ event })
    }
    document.addEventListener('keyup', this.keyUp)
    document.addEventListener('keydown', this.keyDown)
    this.registerCanvas()

    Array.from(this.ref.current.lastChild.children).forEach(node => {
      const nodeNameDiv = node.firstChild.firstChild
      const editor = document.createElement('textarea')
      editor.appendChild(document.createTextNode('sdlfasd;fasdfasdf'))
      nodeNameDiv.insertAdjacentElement('afterend', editor)
    })
  }
}

const StyledGraphCanvas = styled(GraphCanvas)`
  overflow: visible;
  height: 100vh;
  width: 100vw;
`

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
          </div>
          <div className="row">
              <StyledGraphCanvas engine={engine} />
          </div>
      </div>
  )
}

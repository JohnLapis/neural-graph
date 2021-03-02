import React from 'react'
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel
} from '@projectstorm/react-diagrams'
import { CanvasWidget } from '@projectstorm/react-canvas-core'

import styled from '@emotion/styled'

const engine = createEngine()

const node1 = new DefaultNodeModel({ name: 'Node 1', color: 'rgb(0,192,255)' })
node1.setPosition(100, 100)
const port1 = node1.addOutPort('Out')

const node2 = new DefaultNodeModel({ name: 'Node 1', color: 'rgb(0,192,255)' })
node2.setPosition(500, 100)
const port2 = node2.addOutPort('Out')

const link = port1.link<DefaultLinkModel>(port2)

const model = new DiagramModel()
model.addAll(node1, link, node2)
engine.setModel(model)
const MYCanvasWidget = styled(CanvasWidget)`
  overflow: visible;
`

export default function App () {
  return (
        <div className="vw-100 vh-100 grid">
            <MYCanvasWidget engine={engine} />
        </div>
  )
}

import React from 'react'
import { CanvasWidget, TransformLayerWidget, SmartLayerWidget } from '@projectstorm/react-canvas-core'
import styled from '@emotion/styled'

namespace S {
	export const Canvas = styled.div`
	  position: relative;
	  cursor: move;
    overflow: visible;
    height: 100vh; width: 100vw;
`
}

export class GraphCanvas extends CanvasWidget {
    constructor (props) {
    super(props)
    this.state = { zoomedIn: false }
  }

  componentDidUpdate () {
    this.registerCanvas()
    Array.from(this.ref.current.lastChild.children).forEach(node => {
      const nodeNameDiv = node.firstChild.firstChild
      const editor = document.createElement('textarea')
      editor.appendChild(document.createTextNode('sdlfasd;fasdfasdf'))
      nodeNameDiv.insertAdjacentElement('afterend', editor)
    })
  }

  render () {
    const engine = this.props.engine
    const model = engine.getModel()
    return (
          <S.Canvas
              className={this.props.className}
              ref={this.ref}
              onWheel={(event) => {
                this.props.engine.getActionEventBus().fireAction({ event })
              }}
              onMouseDown={(event) => { this.props.engine.getActionEventBus().fireAction({ event }) }}
              onMouseUp={(event) => {
                this.props.engine.getActionEventBus().fireAction({ event })
              }}
              onMouseMove={(event) => {
                this.props.engine.getActionEventBus().fireAction({ event })
              }}
              onDoubleClick={(event) => {
                if (this.state.zoomedIn && event.target === this.ref.current) {
                  model.setZoomLevel(100)
                  this.setState({ zoomedIn: false })
                }
                if (!this.state.zoomedIn && model.getSelectedEntities()) {
                  model.setZoomLevel(200)
                  this.setState({ zoomedIn: true })
                }
              }}> {model.getLayers().map((layer) => {
                return (
                          <TransformLayerWidget layer={layer} key={layer.getID()}>
                              <SmartLayerWidget
                                  layer={layer}
                                  engine={this.props.engine}
                                  key={layer.getID()} />
                          </TransformLayerWidget>
                )
              })}
          </S.Canvas>
    )
  }
}

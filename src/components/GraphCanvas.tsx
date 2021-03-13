import { CanvasWidget, TransformLayerWidget, SmartLayerWidget } from '@projectstorm/react-canvas-core'
import styled from '@emotion/styled'
import { Editor } from './Editor'

export function processNode (node: Element) {
  const nodeTopDiv = node.firstElementChild?.firstElementChild as HTMLElement
  nodeTopDiv.style.height = '200px'
  nodeTopDiv.style.width = '150px'

  ReactDOM.render(
        <Editor />,
        nodeTopDiv
  )
}

namespace S {
 export const Canvas = styled.div`
   position: relative;
   cursor: move;
   overflow: visible;
   height: 100vh; width: 100vw;
`
}

export class GraphCanvas extends CanvasWidget {
  state: { zoomedIn: boolean }

  constructor (props) {
    super(props)
    this.state = { zoomedIn: false }
  }

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

    Array.from(this.ref.current?.lastElementChild?.children || []).forEach(processNode)

    this.registerCanvas()
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
            onMouseDown={(event) => {
              this.props.engine.getActionEventBus().fireAction({ event })
            }}
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

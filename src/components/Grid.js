import React, { Component } from 'react'

export default class Grid extends Component {
  constructor (props) {
    super(props)
    this.state = { edges: [] }
  }

  handleMouseDown (e) {
    if (!e.target.classList.contains('grid')) return
    this.drawEdge()
    this.state.initialPos = getNearestNodePos(getAbsolutePosition(e))
  }

  handleMouseUp (e) {
    if (!e.target.classList.contains('grid')) return
    this.drawEdge()
    this.state.finalPos = getNearestNodePos(getAbsolutePosition(e))
    this.drawEdge()
  }

  drawEdge () {
    this.setState({
      edges: [
        ...this.state.edges,
        drawLine({ start: this.state.initialPos, end: this.state.finalPos })
      ]
    })
  }

  render () {
    return (
      <div
        className="grid"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        { this.state.edges }
      </div>
    )
  }
}

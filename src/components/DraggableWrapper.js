import React, { Component } from 'react'

export default class DraggableWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = { active: false, currentX: 0, currentY: 0 }
    this.dragStart = this.dragStart.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.drag = this.drag.bind(this)
  }

  dragStart (e) {
    if (!e.target.parentElement.classList.contains('draggable')) return
    this.state.active = true
    this.state.initialX = getClientX(e) - this.state.currentX
    this.state.initialY = getClientY(e) - this.state.currentY
  }

  drag (e) {
    if (!this.state.active) return
    e.preventDefault()
    this.state.currentX = getClientX(e) - this.state.initialX
    this.state.currentY = getClientY(e) - this.state.initialY
    const element = e.target.classList.contains('draggable')
      ? e.target.firstChild
      : e.target
    element.style.transform = (
      `translate3d(${this.state.currentX}px, ${this.state.currentY}px, 0)`
    )
  }

  dragEnd () {
    this.state.active = false
  }

  render () {
    return (
      <div
        className="draggable"
        onMouseDown={this.dragStart}
        onMouseMove={this.drag}
        onMouseUp={this.dragEnd}
        onTouchStart={this.dragStart}
        onTouchMove={this.drag}
        onTouchEnd={this.dragEnd}
      >
        {this.props.innerElement}
      </div>
    )
  }
}

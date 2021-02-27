import React, {Component} from 'react';

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.drag = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (!e.target.classList.contains("grid")) return;
    this.drawEdge()
    this. e.
  }

  // since ctx is passed around a lot, this should be a class
  drawDiagonal(ctx, start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke()
  }

  drawEdge(start, end) {
    drawDiagonal({
      start: getNearestNodePos(start),
      end: getNearestNodePos(end),
    })
  }

  render() {
    return (
      <div
      className="grid"
      onMouseDown={this.handleMouseDown}
      onMouseUp={this.handleMouseUp}
      > </div>
    )

  }

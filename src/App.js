import React, {Component} from 'react';

export default function App() {
  return (
    <div className="App">
      <DraggableWrapper innerElement={<div className="teste"></div>}/>
    </div>
  );
}

export class DraggableWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {active: false, xOffset: 0, yOffset: 0}
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.drag = this.drag.bind(this);
  }

  dragStart(e) {
    if (!e.target.parentElement.classList.contains("draggable")) return;
    this.setState({
      active: true,
      xOffset: getClientX(e) - currentX,
      yOffset: getClientY(e) - currentY,
    });
  }

  drag(e) {
    console.log(this.state.active)
    if (!this.state.active) return;
    e.preventDefault();
    const currentX = getClientX(e) - initialX;
    const currentY = getClientY(e) - initialY;
    this.props.innerElement.style.transform = (
      `translate3d(${currentX}px, ${currentY}px, 0)`
    );
  }

  dragEnd() {
    console.log("end")
    this.setState({active: false})
  }

  render() {
    return (
      <div
        className="draggable"
        onMouseDown={this.dragStart}
        onMouseMove={this.drag}
        onMouseUp={this.dragEnd}
      >
        {this.props.innerElement}
      </div>
    )
  }
}

const getClientX = e => (e.type=="touchmove"? e.touches[0]: e).clientX
const getClientY = e => (e.type=="touchmove"? e.touches[0]: e).clientY

function a() {
  window.xOffset = 0;
  window.yOffset = 0;
  let canvas = document.querySelector("#canvas");
  canvas.addEventListener("mousedown", dragStart, false);
  canvas.addEventListener("mousemove", drag, false);
  canvas.addEventListener("mouseup", dragEnd, false);
  function dragStart(e) {
    if (e.target !== dragItem) return;
    initialX = getClientX(e) - currentX;
    initialY = getClientY(e) - currentY;
    active = true
  }

  function dragEnd(e) {
    active = false
  }

  function drag(e) {
    if (!active) return;
    e.preventDefault();
    currentX = getClientX(e) - initialX;
    currentY = getClientY(e) - initialY;
    dragItem.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  function dragElementBlreh(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      element.addEventListener('mousemove', e => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
      })

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    })
  }
}


// since ctx is passed around a lot, this should be a class
function drawDiagonal(ctx, start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke()
}

function drawEdge(start, end) {
  drawDiagonal({
    start: getNearestNodePos(start),
    end: getNearestNodePos(end),
  })
}

function onclick(e) {
  a = e.algo
  wait
  b = e.algo2

  return a,b
}

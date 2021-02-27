import React from 'react';
import DraggableWrapper from './DraggableWrapper';

export default function App() {
  return (
    <div className="vw-100 vh-100">
      <DraggableWrapper innerElement={<div className="teste"></div>}/>
    </div>
  );
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

import React from 'react'
import Grid from './components/Grid'
import DraggableWrapper from './components/DraggableWrapper'

const isMobileEvent = e => e.type === 'touchmove' || e.type === 'touchstart'
const getClientX = e => (isMobileEvent(e) ? e.touches[0] : e).clientX
const getClientY = e => (isMobileEvent(e) ? e.touches[0] : e).clientY
const getAbsolutePosition = e => ({ x: getClientX(e), y: getClientY(e) })

function drawLine ({ start, end }) {
  // ctx.beginPath();
  // ctx.moveTo(start.x, start.y);
  // ctx.lineTo(end.x, end.y);
  // ctx.stroke()
  return <svg></svg>
}

export default function App () {
  return (
    <div className="vw-100 vh-100">
      <Grid>
        <DraggableWrapper innerElement={<div className="teste"></div>}/>
        <DraggableWrapper innerElement={<div className="teste align-right"></div>}/>
      </Grid>
    </div>
  )
}

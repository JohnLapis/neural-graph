import React from 'react';
import DraggableWrapper from './components/DraggableWrapper';

const isMobileEvent = e => e.type === "touchmove" || e.type === "touchstart";
const getClientX = e => (isMobileEvent(e)? e.touches[0]: e).clientX;
const getClientY = e => (isMobileEvent(e)? e.touches[0]: e).clientY;

export default function App() {
  return (
    <div className="vw-100 vh-100">
      <DraggableWrapper innerElement={<div className="teste"></div>}/>
    </div>
  );
}

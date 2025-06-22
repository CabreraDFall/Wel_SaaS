import React from 'react'
import "./btn.css"
function Btn({ text, onClick }) {
  return (
    <button className='btn' onClick={onClick}>{text}</button>
  )
}

export default Btn

import React, { useEffect, useRef, useState } from 'react'
import { shapeData } from '../store/atoms/rectangle'
import { useRecoilState } from 'recoil'

const Canvas = () => {
  const canvasref= useRef(null)
  const contextref= useRef(null)
  
  const startX= useRef(null)
  const startY=useRef(null)
  const [drawing,setdrawing]= useState(false);
  

  const[shape,setShape]= useRecoilState(shapeData)
  

  useEffect(()=>{
    const canvas= canvasref.current
    const canvaspoint= canvas.getBoundingClientRect()
     canvas.width= canvaspoint.width
     canvas.height= canvaspoint.height
    console.log(canvaspoint)
    const context= canvas.getContext('2d')
    context.lineWidth=5
    context.lineCap= "round"
    context.strokeStyle= "black"
    contextref.current= context
  },[])

  const startDrawing=({nativeEvent})=>{
     startX.current= nativeEvent.clientX
     startY.current= nativeEvent.clientY
    //  console.log(nativeEvent)
     setdrawing(true)
     contextref.current.beginPath()
     contextref.current.moveTo(startX,startY)
     contextref.current.lineTo(startX,startY)
     contextref.current.stroke()
     console.log("CLIENT",startX,startY)
     console.log(nativeEvent.offsetX,nativeEvent.offsetY)

     nativeEvent.preventDefault()


  }

  const drawevents=({nativeEvent})=>{
    if(!drawing){
      return
    }
    if(shape=="freehand"){
      const currentX= nativeEvent.clientX;
    const currentY= nativeEvent.clientY
    contextref.current.lineTo(currentX,currentY)
    }
    contextref.current.stroke()
    
  }

  const stopdrawing=()=>{
    contextref.current.closePath()
    setdrawing(false)
  }





  return (
    <div className={`h-[calc(100%-54px)]`} >
        <canvas ref={canvasref} className='w-full h-full border' onPointerDown={startDrawing} onPointerMove={drawevents} onPointerUp={stopdrawing} onPointerLeave={stopdrawing}>
            

        </canvas>
    </div>
  )
}

export default Canvas
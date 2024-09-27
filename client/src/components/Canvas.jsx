import React, { useEffect, useRef, useState } from 'react'
import { shapeData } from '../store/atoms/rectangle'
import { useRecoilState } from 'recoil'
import rough from "roughjs"

const Canvas = () => {
  const canvasref= useRef(null)
  const contextref= useRef(null)
  const circleX= useRef(null)
  const circleY= useRef(null)
  const startX= useRef(null)
  const startY=useRef(null)
  
  const [drawing,setdrawing]= useState(false);
  
  

  const[shape]= useRecoilState(shapeData)
  

  useEffect(()=>{
    const canvas= canvasref.current
    const canvaspoint= canvas.getBoundingClientRect()
     canvas.width= canvaspoint.width
     canvas.height= canvaspoint.height
     
     //rcref.current= rough.canvas(canvas)
    const context= canvas.getContext('2d')
    context.lineWidth=3
    context.lineCap= "round"
    context.strokeStyle= "black"
    
    contextref.current= context
  },[])

  const startDrawing=({nativeEvent})=>{
     startX.current= nativeEvent.offsetX
     startY.current= nativeEvent.offsetY
    //  console.log(nativeEvent)
     setdrawing(true)
     
     contextref.current.moveTo(startX.current,startY.current)
     //contextref.current.lineTo(startX.current,startY.current)
     contextref.current.beginPath()
      contextref.current.stroke()
    

     nativeEvent.preventDefault()
  }

  const drawevents=({nativeEvent})=>{
    if(!drawing){
      return
    }
    if(shape=="freehand"){
      
      const currentX= nativeEvent.offsetX;
    const currentY= nativeEvent.offsetY
    contextref.current.lineTo(currentX,currentY)
    
    }
    // if(shape=="circle"){
    //   circleX.current= nativeEvent.offsetX
    //   circleY.current=nativeEvent.offsetY
      
    //   const radius= Math.sqrt(Math.pow(circleX.current-startX.current,2)+Math.pow(circleX.current-startY.current,2))
    //   //const radius= Math.sqrt(Math.pow(circleX.current-startX.current,2)+Math.pow(circleY.current-startY.current,2))
      
    //   contextref.current.arc(startX.current,startY.current,radius,0,2*Math.PI)
      
      

    // }
    contextref.current.stroke()
    
    
    
    
  }

  const stopdrawing=({nativeEvent})=>{
    if(shape=="circle"){
      //contextref.current.clearRect(0,0,canvasref.current.width,canvasref.current.height)
      circleX.current= nativeEvent.offsetX
      circleY.current=nativeEvent.offsetY
      const radius= Math.sqrt(Math.pow(circleX.current-startX.current,2)+Math.pow(circleY.current-startY.current,2))
      contextref.current.globalCompositeOperation= "source-over"
      contextref.current.arc(startX.current,startY.current,radius,0,2*Math.PI)
      contextref.current.stroke()
      // contextref.current.shadowOffsetX=-10
      
    
     
   }
    contextref.current.closePath()
    setdrawing(false)
  }
  const leavedrawing=()=>{
    contextref.current.closePath()
    setdrawing(false)
  }





  return (
    <div className={`h-[calc(100%-54px)]`} >
        <canvas ref={canvasref} className='w-full h-full border' onPointerDown={startDrawing} onPointerMove={drawevents} onPointerUp={stopdrawing} onPointerLeave={leavedrawing}>
            

        </canvas>
    </div>
  )
}

export default Canvas
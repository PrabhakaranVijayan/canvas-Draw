import React, { useEffect, useRef, useState } from 'react'
import { shapeData } from '../store/atoms/rectangle'
import { useRecoilState } from 'recoil'
import rough from "roughjs"

const Canvas = () => {
  const canvasref= useRef(null)
  const contextref= useRef(null)
  const roughj= useRef(null)
  
  const startX= useRef(null)
  const startY= useRef(null)
  const mouseX=useRef(null)
  const mouseY=useRef(null)
  
  const [drawing,setdrawing]= useState(false);
  const [erasing,seterasing]= useState(false)
  const [shapes,setShapes]= useState([])
  const [linepath,setlinepath]= useState()
  const[shape]= useRecoilState(shapeData)
  const pointsRef= useRef([])
  const eraseRef= useRef([])
  
  
  

  useEffect(()=>{
    const canvas= canvasref.current
    
     //canvaspoints.current={x:canvaspoint.left,y:canvaspoint.top,width:canvaspoint.width,height:canvaspoint.height}
     
     const context= canvas.getContext('2d')
    roughj.current= rough.canvas(canvas)
    
    const resizecanvas=()=>{
      canvas.width= window.innerWidth
      canvas.height= window.innerHeight-54
      context.lineWidth=2
      context.lineCap= "round"
      context.strokeStyle= "black"
      contextref.current= context
      redrawcanvas()
      
   
    }
    resizecanvas()
    window.addEventListener("resize",resizecanvas)

    return () => {
      window.removeEventListener('resize', resizecanvas)
    }
 //requestAnimationFrame(rendercanvas)

  },[shapes,linepath])

  const redrawcanvas=()=>{
    const canvas= canvasref.current
    const context= contextref.current
    const canvaspoint= canvas.getBoundingClientRect()

    context.clearRect(canvaspoint.left,canvaspoint.top,canvaspoint.width,canvaspoint.height)

    if(shapes.length==0){
      return
    }
    else{
      shapes.forEach((eachshape)=>rendering(eachshape))

    }
    

    if(linepath){
      rendering(linepath)
    }
  }

  

  const startDrawing=({nativeEvent})=>{
    setdrawing(true)
      startX.current= nativeEvent.offsetX
      startY.current= nativeEvent.offsetY

      if(shape=="freehand"){
        pointsRef.current=[{x:startX.current,y:startY.current}]
        setlinepath({type:"freehand",points:[{x:startX.current,y:startY.current}]})
        console.log("linepath",linepath)
        return
      }
      else if(shape=="circle"){
        setlinepath({type:"circle",points:{x:startX.current,y:startY.current}})
        console.log("circle",linepath)
        return
      }
      else if(shape=="rectangle"){
        setlinepath({type:"rectangle",points:{x:startX.current,y:startY.current,endx:startX.current,endy:startY.current}})
        return

      }
      else if(shape=="erase"){
        seterasing(true)
        eraseRef.current=[{x:startX.current,y:startY.current}]
        contextref.current.globalCompositeOperation="destination-out"
        setlinepath({type:"erase",points:[{x:startX.current,y:startY.current}]})

        return
      }
      
    
  }

  //tracking mouse points

  const drawevents=({nativeEvent})=>{
    if(!drawing){
      return
    }
     mouseX.current= nativeEvent.offsetX
     mouseY.current= nativeEvent.offsetY
     if(shape=="freehand"){
       pointsRef.current.push({x:mouseX.current,y:mouseY.current})
      rendering({type:"freehand",points:pointsRef.current})
      return
     }
     else if(shape=="circle"){
      setlinepath(prev=>({...prev,points:{x:startX.current,y:startY.current,endx:mouseX.current,endy:mouseY.current}}))
      return
    }
     else if(shape=="rectangle"){
      setlinepath(prev=>({...prev,points:{x:startX.current,y:startY.current,endx:mouseX.current,endy:mouseY.current}}))
      return
    }
    else if(shape=="erase"){
      eraseRef.current.push({x:mouseX.current,y:mouseY.current})
      contextref.current.globalCompositeOperation= "destination-out"
      
      contextref.current.arc(mouseX.current,mouseY.current,5,0,2*Math.PI)
      contextref.current.strokeStyle=5
      contextref.current.strokeStyle="	#FFFFFF"
      contextref.current.stroke()
      
    }
    
    
  }

  // stop drawing

  const stopdrawing=()=>{
    
    
    if(linepath && drawing){
      setShapes(prevshapes=>([...prevshapes,linepath]))
      setlinepath(null)
    }
    if((drawing&& pointsRef)&& shape=="freehand"){
      setShapes(prevshapes=>([...prevshapes,{type:"freehand",points:pointsRef.current}]))
      
    }
    if((erasing && eraseRef)&& shape=="erase"){
      setShapes(prevshapes=>([...prevshapes,{type:"erase",points:eraseRef.current}]))
    }
    if(shape=="erase"){
      contextref.current.globalCompositeOperation="source-over"
      seterasing(false)
    }
    setdrawing(false)
    
  }
  //leave canvas
  const leavedrawing=()=>{
    contextref.current.closePath()
    setdrawing(false)
  }

  
  const rendering=(eachshape)=>{
    contextref.current.beginPath()
    
      if(eachshape.type=="freehand"){
        eachshape.points.forEach((point,index)=>{
          if(index ==0){
            contextref.current.moveTo(point.x,point.y)
          }
          else{
            contextref.current.lineTo(point.x,point.y)
            contextref.current.strokeStyle="black"
            contextref.current.stroke()
          }
        })

      }
        
      if(eachshape.type=="circle"){
         const radius= Math.sqrt(Math.pow(eachshape.points.endx-eachshape.points.x,2)+Math.pow(eachshape.points.endy-eachshape.points.y,2)) 
          roughj.current.circle(eachshape.points.x,eachshape.points.y,2*radius) 
          console.log(shapes)

      }
      if(eachshape.type=="rectangle"){
        const rectwidth= eachshape.points.endx-eachshape.points.x
        const rectheight= eachshape.points.endy-eachshape.points.y
        roughj.current.rectangle(eachshape.points.x,eachshape.points.y,rectwidth,rectheight)
      }
      if(eachshape.type=="erase"){
        eachshape.points.forEach((point,index)=>{
          if(index ==0){
            contextref.current.moveTo(point.x,point.y)
          }
          else{
            contextref.current.arc(point.x,point.y,5,0,2*Math.PI)
            contextref.current.strokeStyle="	#FFFFFF"
            contextref.current.stroke()
          }
      })
    }
 
  }

  // const addtext=({nativeEvent})=>{
  //   const x= nativeEvent.offsetX
  //   const y= nativeEvent.offsetY

  //   return(
  //    <input type='text' />
  //   )

  // }
 
  return (
    <div className={`h-[calc(100%-54px)]`} >
        <canvas ref={canvasref} className='w-full h-full border bg-white' onPointerDown={startDrawing} onPointerMove={drawevents} onPointerUp={stopdrawing} onPointerLeave={leavedrawing} >
            

        </canvas>
    </div>
  )
}

export default Canvas
import React, { useState } from 'react'
import pencil from '../assets/pencil-regular-24.png'
import circle from '../assets/circle-regular-24.png'
import rectangle from '../assets/rectangle-regular-24.png'
import arrow from '../assets/arrow-back-regular-24.png'
import eraser from '../assets/eraser-regular-24.png'
import Canvas from './Canvas'
import { useRecoilState } from 'recoil'
import { shapeData } from '../store/atoms/rectangle'

const Toolbar = () => {
  const[shape,setShape]= useRecoilState(shapeData)
  
  return (
    <div >
      <div className='flex justify-center py-2'>
        <div className='w-1/2 flex justify-evenly bg-slate-200 py-2 rounded-sm  '>
            <img src={pencil} onClick={()=>setShape("freehand")} className='size-5' />
            <img src={rectangle} onClick={()=>setShape("rectangle")} className='size-5'  />
            <img src={circle} onClick={()=>setShape("circle")} className='size-5'  />
            <img src={arrow} onClick={()=>setShape("arrow")} className='size-5'  />
            <img src={eraser} onClick={()=>setShape("erase")} className='size-5'  />
        </div> 

      </div>
      
        

    </div>
  )
}

export default Toolbar
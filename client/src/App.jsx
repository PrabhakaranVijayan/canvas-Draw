

import './App.css'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import  {RecoilRoot}  from 'recoil'

function App () {
 return (
  <RecoilRoot>
    <div className='h-screen w-screen'>
      <Toolbar />
      <Canvas />
    
    </div>

  </RecoilRoot>
  
 )
}

export default App

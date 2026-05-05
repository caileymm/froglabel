import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'
import { useState } from 'react'  // ← add this



function App() {
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
 return (
   <div>
     <Header />
     <div className='px-5 py-2 flex-column items-center justify-center'>
       <BoundingBoxControls/>
       <WaveformSpectrogram zoomX={zoomX} zoomY={zoomY} />
       <SpectrogramControls zoomX={zoomX} setZoomX={setZoomX} zoomY={zoomY} setZoomY={setZoomY} />
       <Dataset />
     </div>
   </div>
 )
}


export default App




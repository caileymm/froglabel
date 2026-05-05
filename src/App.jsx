import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'
import { useState, useRef } from 'react' 



function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const scrollRef = useRef(null);
 return (
   <div>
     <Header />
     <div className='px-5 py-2 flex-column items-center justify-center'>
       <BoundingBoxControls 
        code={code}
        setCode={setCode}
        boxes={boxes}
        setBoxes={setBoxes}
        currSelectedBox={currSelectedBox}
        setCurrSelectedBox={setCurrSelectedBox}
        />
       <WaveformSpectrogram zoomX={zoomX} zoomY={zoomY} scrollRef={scrollRef}
        code={code}
        boxes={boxes}
        setBoxes={setBoxes}
        currSelectedBox={currSelectedBox}
        setCurrSelectedBox={setCurrSelectedBox}
        />
       <SpectrogramControls zoomX={zoomX} setZoomX={setZoomX} zoomY={zoomY} setZoomY={setZoomY} scrollRef={scrollRef} />
       <Dataset />
     </div>
   </div>
 )
}


export default App




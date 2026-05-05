import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'
import {useState} from 'react';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);

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
       <WaveformSpectrogram
        code={code}
        boxes={boxes}
        setBoxes={setBoxes}
        currSelectedBox={currSelectedBox}
        setCurrSelectedBox={setCurrSelectedBox}
        />
       <SpectrogramControls/>
       <Dataset />
     </div>
   </div>
 )
}


export default App




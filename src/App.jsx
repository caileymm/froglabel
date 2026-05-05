import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'
import { useState, useRef } from 'react' 
import audioSrc from './assets/frogsounds.mp3';



function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollRef = useRef(null);
  const audioRef = useRef(null);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback failed:', err);
      }
    }
  };

 return (
   <div>
    <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
    />

     <Header />
     <div className='px-5 py-2 flex-column items-center justify-center'>
       <BoundingBoxControls 
        code={code}
        setCode={setCode}
        boxes={boxes}
        setBoxes={setBoxes}
        currSelectedBox={currSelectedBox}
        setCurrSelectedBox={setCurrSelectedBox}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        />
       <WaveformSpectrogram 
        zoomX={zoomX} 
        zoomY={zoomY} 
        scrollRef={scrollRef}
        code={code}
        boxes={boxes}
        setBoxes={setBoxes}
        currSelectedBox={currSelectedBox}
        setCurrSelectedBox={setCurrSelectedBox}
        />
       <SpectrogramControls 
        zoomX={zoomX} 
        setZoomX={setZoomX} 
        zoomY={zoomY} 
        setZoomY={setZoomY} 
        scrollRef={scrollRef} 
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        />
       <Dataset />
     </div>
   </div>
 )
}


export default App




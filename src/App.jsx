import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Tools from './components/Tools'
import Dataset from './components/Dataset'
import CodesPanel from './components/CodesPanel'
import { useState, useRef, useCallback, useEffect } from 'react'
import audioSrc from './assets/frogsounds.mp3';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(null); // null | 2 | 3
  const [showDataset, setShowDataset] = useState(false);
  const scrollRef = useRef(null);
  const audioRef = useRef(null);

  const togglePlayPause = useCallback(async () => {
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
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') setShowLeftPanel(prev => !prev);
      if (e.key === '2') setRightPanel(prev => prev === 2 ? null : 2);
      if (e.key === '3') setRightPanel(prev => prev === 3 ? null : 3);
      if (e.key === '4') setShowDataset(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
      />
      <Header />

      <div className='flex gap-2 px-2 py-2 flex-1 min-h-0 overflow-hidden items-stretch'>

        {/* Left Panel (1) */}
        {showLeftPanel && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            <CodesPanel />
          </div>
        )}

        {/* Middle: Main + Bottom */}
        <div className='flex-1 min-w-0 min-h-0 flex flex-col gap-2'>

          {/* Main Content */}
          <div className='flex-1 min-h-0 flex flex-col overflow-y-auto'>
            <div className='p-2 bg-[#82A062] rounded-xl flex flex-col gap-2'>
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
              <SpectrogramControls
                zoomX={zoomX}
                setZoomX={setZoomX}
                zoomY={zoomY}
                setZoomY={setZoomY}
                scrollRef={scrollRef}
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
              />
            </div>
            <WaveformSpectrogram
              zoomX={zoomX}
              zoomY={zoomY}
              scrollRef={scrollRef}
              code={code}
              boxes={boxes}
              setBoxes={setBoxes}
              currSelectedBox={currSelectedBox}
              setCurrSelectedBox={setCurrSelectedBox}
              compact={showDataset}
            />
            <Tools />
          </div>

          {/* Bottom Dataset Panel (4) */}
          {showDataset && (
            <div className='h-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
              <Dataset />
            </div>
          )}
        </div>

        {/* Right Panel — Box Panel (2) or Spectrogram Panel (3) */}
        {rightPanel !== null && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            {rightPanel === 2 && <div> {/* Box Panel */} </div>}
            {rightPanel === 3 && <div>{/* Spectrogram Panel */}</div>}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
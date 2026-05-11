import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Tools from './components/Tools'
import CodesPanel from './components/CodesPanel'
import DatasetPanel from './components/DatasetPanel'
import BoxFilePanel from './components/BoxFilePanel'
import SpectrogramPanel from './components/SpectrogramPanel'
import { useState, useRef, useCallback, useEffect } from 'react'

function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [codesDict, setCodesDict] = useState({});
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(null); // null | 2 | 3
  const [showDataset, setShowDataset] = useState(false);

  const scrollRef = useRef(null);
  const wavesurferRef = useRef(null);

  const togglePlayPause = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.playPause();
  }, []);

  // Keyboard shortcuts: 1=left panel, 2=box panel, 3=spectrogram panel, 4=dataset
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
      <Header />

      <div className='flex gap-2 px-2 py-2 flex-1 min-h-0 overflow-hidden items-stretch'>

        {/* Left Panel (key: 1) — Codes */}
        {showLeftPanel && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            <CodesPanel
              codesDict={codesDict}
              setCodesDict={setCodesDict}
            />
          </div>
        )}

        {/* Middle: Controls + Waveform + Tools */}
        <div className='flex-1 min-w-0 min-h-0 flex flex-col gap-2'>

          {/* Controls bar */}
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
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
            />
          </div>

          {/* Waveform + Spectrogram */}
          <div className='flex-1 min-h-0 overflow-y-auto'>
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
            <Tools />
          </div>

          {/* Bottom Dataset Panel (key: 4) */}
          {showDataset && (
            <div className='h-40 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
              <DatasetPanel />
            </div>
          )}
        </div>

        {/* Right Panel (key: 2 or 3) */}
        {rightPanel !== null && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            {rightPanel === 2 && <div><BoxFilePanel/></div>}
            {rightPanel === 3 && <div><SpectrogramPanel/></div>}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
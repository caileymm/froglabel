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
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

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
  
  // Ref to wavesurfer instance, set by WaveformSpectrogram via callback
  const wavesurferRef = useRef(null);

  const togglePlayPause = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.playPause();
  }, []);

  const [duration, setDuration] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const SPECTROGRAM_HEIGHT = 400;
  const FREQUENCY_MIN = 0;
  const FREQUENCY_MAX = 5000;
const melFromHz = (hz) => 2595 * Math.log10(1 + hz / 700);
const hzFromMel = (mel) => 700 * (Math.pow(10, mel / 2595) - 1);
const MEL_MIN = melFromHz(FREQUENCY_MIN);
const MEL_MAX = melFromHz(FREQUENCY_MAX);

const yToFreq = (y) => {
  const fraction = 1 - y / SPECTROGRAM_HEIGHT;       // 0=bottom, 1=top
  const mel = MEL_MIN + fraction * (MEL_MAX - MEL_MIN);
  const hz = hzFromMel(mel);
  return Math.max(FREQUENCY_MIN, Math.min(FREQUENCY_MAX, hz)); // clamp
};

  const rows = useMemo(() => {

    return boxes.map((box, index) => {
      const startTime  = (box.left / containerWidth) * duration;
      const endTime    = ((box.left + box.width) / containerWidth) * duration;
      const endFreq   = yToFreq(box.top);
      const startFreq = yToFreq(box.top + box.height);

      return {
        id:        index + 1,
        code:      box.code,
        name:      codesDict[box.code] ?? '',
        startTime: startTime.toFixed(2),
        endTime:   endTime.toFixed(2),
        duration:  (endTime - startTime).toFixed(2),
        startFreq: Math.round(Math.max(0, startFreq)),
        endFreq:   Math.round(Math.min(FREQUENCY_MAX, endFreq)),
        bandwidth: Math.round(endFreq - startFreq),
      };
    });
  }, [boxes, codesDict, duration, containerWidth]);

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
              setCodesDict={setCodesDict}/>
          </div>
        )}

        {/* Middle: Controls + Waveform + Tools */}
        <div className='flex-1 min-w-0 min-h-0 flex flex-col'>

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
              zoomX={zoomX} 
              setZoomX={setZoomX} 
              zoomY={zoomY} 
              setZoomY={setZoomY} 
              />
          </div>

          {/* Waveform + Spectrogram */}
          <div className='flex-1 min-h-0 overflow-y-auto'>
            <WaveformSpectrogram
              code={code}
              boxes={boxes}
              setBoxes={setBoxes}
              currSelectedBox={currSelectedBox}
              setCurrSelectedBox={setCurrSelectedBox}
              setDuration={setDuration}
              setContainerWidth={setContainerWidth}
            />
            <Tools/>
          </div>

          {/* Bottom Dataset Panel (key: 4) */}
          {showDataset && (
            <div className='h-40 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
              <DatasetPanel 
                rows={rows}/>
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
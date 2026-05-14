import './App.css'
import { usePanels } from './components/PanelContext';
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
import { yToFreq } from './utils/spectrogramScale'

function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [codesDict, setCodesDict] = useState({
    'GRE': 'Green Tree Frog',
    'COR': 'Corroboree Frog',
    'SOU': 'Southern Bell Frog',
    'RED': 'Red-Eyed Tree Frog',
    'BLU': 'Blue Mountains Tree Frog',
    'POU': 'Pouched Frog',
    'GRO': 'Growling Grass Frog',
    'PER': "Peron's Tree Frog",
    'BRE': "Brereton's Frog",
    'GIA': 'Giant Burrowing Frog',
  });
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [showLeftPanel, setShowLeftPanel] = useState(false);
  // const [rightPanel, setRightPanel] = useState(null); // null | 2 | 3
  // const [showDataset, setShowDataset] = useState(false);
  const { showLeftPanel, setShowLeftPanel, rightPanel, setRightPanel, showDataset, setShowDataset} = usePanels();
  const [duration, setDuration] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [drawingBox, setDrawingBox] = useState(null);

  const wavesurferRef = useRef(null);

  const togglePlayPause = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.playPause();
  }, []);

  // Convert a raw pixel box to time/frequency row data
  const boxToRow = useCallback((box) => {
    if (!box) return null;
    const startTime = containerWidth > 0 ? (box.left / containerWidth) * duration : 0;
    const endTime   = containerWidth > 0 ? ((box.left + box.width) / containerWidth) * duration : 0;
    const startFreq = yToFreq(box.top + box.height);
    const endFreq   = yToFreq(box.top);
    return {
      ...box,
      name:      codesDict[box.code] ?? '—',
      startTime: startTime.toFixed(3),
      endTime:   endTime.toFixed(3),
      duration:  (endTime - startTime).toFixed(3),
      startFreq: Math.round(startFreq),
      endFreq:   Math.round(endFreq),
      bandwidth: Math.round(endFreq - startFreq),
    };
  }, [containerWidth, duration, codesDict]);

  // Derived rows — boxes converted to time/freq values
  const rows = useMemo(() => boxes.map(boxToRow), [boxes, boxToRow]);

  const selectedRow = rows[currSelectedBox] ?? null;
  const drawingRow  = boxToRow(drawingBox);


  // Resizable dataset panel
  const [datasetHeight, setDatasetHeight] = useState(160);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const handleDragStart = (e) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartHeight.current = datasetHeight;
    document.body.style.cursor = 'ns-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta = dragStartY.current - e.clientY;
      const newHeight = Math.max(80, Math.min(400, dragStartHeight.current + delta));
      setDatasetHeight(newHeight);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <Header />

      <div className='flex gap-2 px-2 py-2 flex-1 min-h-0 overflow-hidden items-stretch'>

        {/* Left Panel (key: 1) — Codes */}
        {showLeftPanel && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            <CodesPanel codesDict={codesDict} setCodesDict={setCodesDict} />
          </div>
        )}

        {/* Middle: Controls + Waveform + Tools */}
        <div className='flex-1 min-w-0 min-h-0 flex flex-col'>

          {/* Controls bar */}
          <div className='p-2 bg-[#82A062] rounded-xl flex flex-wrap justify-center items-center gap-1.5'>
            <SpectrogramControls
              zoomX={zoomX}
              setZoomX={setZoomX}
              zoomY={zoomY}
              setZoomY={setZoomY}
            />
            <BoundingBoxControls
              code={code}
              setCode={setCode}
              codesDict={codesDict}
              boxes={boxes}
              setBoxes={setBoxes}
              currSelectedBox={currSelectedBox}
              setCurrSelectedBox={setCurrSelectedBox}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
            />
          </div>

          {/* Waveform + Spectrogram */}
          <div className='flex-1 min-h-0 overflow-hidden flex flex-col'>
            <WaveformSpectrogram
              code={code}
              boxes={boxes}
              setBoxes={setBoxes}
              currSelectedBox={currSelectedBox}
              setCurrSelectedBox={setCurrSelectedBox}
              setDuration={setDuration}
              setContainerWidth={setContainerWidth}
              setDrawingBox={setDrawingBox}
            />
            <Tools showDataset={showDataset} 
                   showRightPanel = {rightPanel}
                   showLeftPanel = {showLeftPanel}/>
          </div>

          {/* Bottom Dataset Panel (key: 4) */}
          {/* !!!!!!!!!!!!!!!!when this pannel is shown the buttons are hidden !!!!!!!!!!!!!!!!!!!*/}
          {showDataset && (
            <div
              className='shrink-0 bg-[#82A062] rounded-xl overflow-y-auto'
              style={{ height: datasetHeight }}
            >
              <div
                className='h-2 cursor-ns-resize'
                onMouseDown={handleDragStart}
              />
              <div className='px-2 pb-2'>
                <DatasetPanel
                  rows={rows}
                  onDeleteRow={(i) => setBoxes(prev => prev.filter((_, idx) => idx !== i))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Panel (key: 2 or 3) */}
        {rightPanel !== null && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            {rightPanel === 2 && (
              <BoxFilePanel
                selectedRow={selectedRow}
                drawingRow={drawingRow}
              />
            )}
            {rightPanel === 3 && <SpectrogramPanel />}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
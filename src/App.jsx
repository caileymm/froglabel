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
import { yToFreq } from './utils/spectrogramScale'

function App() {
  const [boxes, setBoxes] = useState([]);
  const [code, setCode] = useState('');
  const [codesDict, setCodesDict] = useState({
    'GRE' : 'Green Tree Frog',
    'COR' : 'Corroboree Frog',
    'SOU' : 'Southern Bell Frog',
    'RED' : 'Red-Eyed Tree Frog',
    'BLU' : 'Blue Mountains Tree Frog',
    'POU' : 'Pouched Frog',
    'GRO' : 'Growling Grass Frog',
    'PER' : 'Peron’s Tree Frog',
    'BRE' : 'Brereton’s Frog',
    'GIA' : 'Giant Burrowing Frog'
  });
  const [currSelectedBox, setCurrSelectedBox] = useState(-1);
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(null); // null | 2 | 3
  const [showDataset, setShowDataset] = useState(false);
  const [duration, setDuration] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const wavesurferRef = useRef(null);

  const togglePlayPause = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.playPause();
  }, []);

  const rows = useMemo(() => {
    return boxes.map((box, index) => {
      const startTime = (box.left / containerWidth) * duration;
      const endTime   = ((box.left + box.width) / containerWidth) * duration;
      const endFreq   = yToFreq(box.top);
      const startFreq = yToFreq(box.top + box.height);

      return {
        id:        index + 1,
        code:      box.code,
        name:      codesDict[box.code] ?? '',
        startTime: startTime.toFixed(2),
        endTime:   endTime.toFixed(2),
        duration:  (endTime - startTime).toFixed(2),
        startFreq: Math.round(startFreq),
        endFreq:   Math.round(endFreq),
        bandwidth: Math.round(endFreq - startFreq),
      };
    });
  }, [boxes, codesDict, duration, containerWidth]);

  const handleDeleteBox = (i) => {
    setBoxes(boxes.filter((_, idx) => idx !== i));
  };

  const [drawingBox, setDrawingBox] = useState(null);

  const drawingRow = useMemo(() => {
    if (!drawingBox || !containerWidth || !duration) return null;
    const startTime = (drawingBox.left / containerWidth) * duration;
    const endTime   = ((drawingBox.left + drawingBox.width) / containerWidth) * duration;
    const endFreq   = yToFreq(drawingBox.top);
    const startFreq = yToFreq(drawingBox.top + drawingBox.height);
    return {
      code:      drawingBox.code,
      startTime: startTime.toFixed(2),
      endTime:   endTime.toFixed(2),
      duration:  (endTime - startTime).toFixed(2),
      startFreq: Math.round(startFreq),
      endFreq:   Math.round(endFreq),
      bandwidth: Math.round(endFreq - startFreq),
    };
  }, [drawingBox, containerWidth, duration, code]);

  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (currSelectedBox !== -1 && rows[currSelectedBox]) {
      setSelectedRow(rows[currSelectedBox]);
    } else {
      setSelectedRow(null);
    }
  }, [rows, currSelectedBox]);

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

  const [datasetHeight, setDatasetHeight] = useState(95);
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
      const delta = dragStartY.current - e.clientY; // dragging up = positive = taller
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
          <div className='p-2 bg-[#82A062] rounded-xl flex flex-col gap-1.5'>
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
              setDrawingBox={setDrawingBox}
              showDataset={showDataset}
            />
            <Tools />
          </div>

          {/* Bottom Dataset Panel (key: 4) */}
          {showDataset && (
            <div
              className='shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'
              style={{ height: datasetHeight }}
            >
              {/* Drag handle */}
              <div
                className='w-full flex items-center justify-center mb-1 cursor-ns-resize'
                onMouseDown={handleDragStart}
              >
                <div className='w-12 h-1 bg-[#1E1E1E] opacity-30 rounded-full' />
              </div>
              <DatasetPanel rows={rows} onDeleteRow={handleDeleteBox} />
            </div>
          )}
        </div>

        {/* Right Panel (key: 2 or 3) */}
        {rightPanel !== null && (
          <div className='w-48 shrink-0 bg-[#82A062] rounded-xl p-2 overflow-y-auto'>
            {rightPanel === 2 && <BoxFilePanel selectedRow={selectedRow} currSelectedBox={currSelectedBox} drawingRow={drawingRow} />}
            {rightPanel === 3 && <SpectrogramPanel />}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
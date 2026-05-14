import { useState, useEffect, useCallback } from 'react';
import { wavesurferRef } from './WaveformSpectrogram.jsx';

function SpectrogramControls({ zoomX, setZoomX, duration, setVisibleTime }) {
  const [isVPressed, setIsVPressed] = useState(false);
  const [isAPressed, setIsAPressed] = useState(false);
  const [isDPressed, setIsDPressed] = useState(false);
  const [isQPressed, setIsQPressed] = useState(false);
  const [isEPressed, setIsEPressed] = useState(false);
  const [isCPressed, setIsCPressed] = useState(false);

  const [isPlaying, setPlaying] = useState(false);
  const [wsZoom, setWsZoom] = useState(5);

  const handlePlayAudio = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const getWsScrollContainer = () => {
    const ws = wavesurferRef.current;
    if (!ws) return null;
    return ws.getWrapper()?.parentElement;
  };

  const updateVisibleTime = useCallback((currentZoom) => {
    const ws = wavesurferRef.current;
    const container = getWsScrollContainer();
    if (!container || !currentZoom) return;

    // Time = Distance / PixelsPerSecond
    const start = container.scrollLeft / currentZoom;
    let end = (container.scrollLeft + container.clientWidth) / currentZoom;

    if (end > duration) {
      end = duration;
    }

    setVisibleTime({start: start, end: end});
    console.log(`Current View: ${start.toFixed(2)}s - ${end.toFixed(2)}s`);
  }, [setVisibleTime, duration]);

const handleZoomInX = useCallback(() => {
  const ws = wavesurferRef.current;
  if (!ws || !duration) return;
  const newZoom = Math.min(wsZoom + 20, 500);
  ws.zoom(newZoom);
  setWsZoom(newZoom);
  
  // Wait for the container to expand before calculating
  requestAnimationFrame(() => updateVisibleTime(newZoom));
}, [wsZoom, duration, updateVisibleTime]);

const handleZoomOutX = useCallback(() => {
  const ws = wavesurferRef.current;
  if (!ws || !duration) return;
  const newZoom = Math.max(wsZoom - 20, 5);
  ws.zoom(newZoom);
  setWsZoom(newZoom);

  requestAnimationFrame(() => updateVisibleTime(newZoom));
}, [wsZoom, duration, updateVisibleTime]);

const handlePanLeft = useCallback(() => {
  const container = getWsScrollContainer();
  if (container) {
    container.scrollLeft -= 100;
    // Panning doesn't change zoom, so use current wsZoom
    requestAnimationFrame(() => updateVisibleTime(wsZoom));
  }
}, [wsZoom, updateVisibleTime]);

const handlePanRight = useCallback(() => {
  const container = getWsScrollContainer();
  if (container) {
    container.scrollLeft += 100;
    requestAnimationFrame(() => updateVisibleTime(wsZoom));
  }
}, [wsZoom, updateVisibleTime]);

  const handleResetView = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.zoom(5);
    setWsZoom(5);
    setZoomX(1);
  }, [setZoomX]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v') { setIsVPressed(true);  handlePlayAudio();  }
      if (e.key === 'a') { setIsAPressed(true);  handlePanLeft();    }
      if (e.key === 'd') { setIsDPressed(true);  handlePanRight();   }
      if (e.key === 'q') { setIsQPressed(true);  handleZoomInX();    }
      if (e.key === 'e') { setIsEPressed(true);  handleZoomOutX();   }
      if (e.key === 'c') { setIsCPressed(true);  handleResetView();  }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'v') setIsVPressed(false);
      if (e.key === 'a') setIsAPressed(false);
      if (e.key === 'd') setIsDPressed(false);
      if (e.key === 'q') setIsQPressed(false);
      if (e.key === 'e') setIsEPressed(false);
      if (e.key === 'c') setIsCPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePlayAudio, handlePanLeft, handlePanRight, handleZoomInX, handleZoomOutX, handleResetView]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;
      clearInterval(interval);
      const unsubs = [
        ws.on('play',  () => setPlaying(true)),
        ws.on('pause', () => setPlaying(false)),
      ];
      return () => unsubs.forEach(fn => fn());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex items-center justify-center gap-2 flex-wrap'>

      <button
        onClick={handlePlayAudio}
        className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isVPressed ? 'bg-[#B4D2EF]' : 'bg-[#CAE4EF] hover:bg-[#B4D2EF]'}`}
      >
        {isPlaying ? 'Pause Audio' : 'Play Audio'}
        <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>V</div>
      </button>

      <div className='p-1.5 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button
          onClick={handlePanLeft}
          className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
            ${isAPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}
        >
          Pan Left
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>A</div>
        </button>
        <button
          onClick={handlePanRight}
          className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
            ${isDPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}
        >
          Pan Right
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>D</div>
        </button>
      </div>

      <div className='p-1.5 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button
          onClick={handleZoomInX}
          className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
            ${isQPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}
        >
          Zoom In (X)
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>Q</div>
        </button>
        <button
          onClick={handleZoomOutX}
          className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
            ${isEPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}
        >
          Zoom Out (X)
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>E</div>
        </button>
        <button
          onClick={handleResetView}
          className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
            ${isCPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}
        >
          Reset View
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>C</div>
        </button>
      </div>

    </div>
  );
}

export default SpectrogramControls;
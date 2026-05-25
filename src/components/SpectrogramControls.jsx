import { useState, useEffect, useCallback } from 'react';
import { wavesurferRef } from './WaveformSpectrogram.jsx';
import { usePanels } from './PanelContext';



function SpectrogramControls({ zoomX, setZoomX, duration, setVisibleTime, theme, setDrawingBox }) {
  const [isVPressed, setIsVPressed] = useState(false);
  const [isAPressed, setIsAPressed] = useState(false);
  const [isDPressed, setIsDPressed] = useState(false);
  const [isQPressed, setIsQPressed] = useState(false);
  const [isEPressed, setIsEPressed] = useState(false);
  // const [isWPressed, setIsWPressed] = useState(false);
  // const [isRPressed, setIsRPressed] = useState(false);
  const [isCPressed, setIsCPressed] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [wsZoom, setWsZoom] = useState(0);

  const { lowCutoff, highCutoff, setLowCutoff, setHighCutoff } = usePanels();
  const { maxFreq } = usePanels();

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
    if (!container || currentZoom === null || currentZoom === undefined) return;
    if (currentZoom === 0) {
      // When zoom is 0, show full duration
      setVisibleTime({ start: 0, end: duration });
      return;
    }
    const start = container.scrollLeft / currentZoom;
    let end = (container.scrollLeft + container.clientWidth) / currentZoom;
    if (end > duration) end = duration;
    setVisibleTime({ start, end });
  }, [setVisibleTime, duration]);

  const handleZoomInX = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws || !duration) return;
    const newZoom = Math.min(wsZoom + 50, 500);
    ws.zoom(newZoom);
    setWsZoom(newZoom);
    requestAnimationFrame(() => updateVisibleTime(newZoom));
  }, [wsZoom, duration, updateVisibleTime]);

  const handleZoomOutX = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws || !duration) return;
    const newZoom = Math.max(wsZoom - 50, 0);
    ws.zoom(newZoom);
    setWsZoom(newZoom);
    requestAnimationFrame(() => updateVisibleTime(newZoom));
  }, [wsZoom, duration, updateVisibleTime]);

  /*
  const handleFreqZoomIn = useCallback(()  => {
    const center = (lowCutoff + highCutoff) / 2;
    const newRange = (highCutoff - lowCutoff) / 1.5;
    setLowCutoff(Math.max(0, center - newRange / 2));
    setHighCutoff(Math.min(maxFreq, center + newRange / 2)); 
  }, [lowCutoff, highCutoff, maxFreq]);

  const handleFreqZoomOut = useCallback(() => {
      const center = (lowCutoff + highCutoff) / 2;
      const newRange = (highCutoff - lowCutoff) * 1.5;
      setLowCutoff(Math.max(0, center - newRange / 2));
      setHighCutoff(Math.min(maxFreq, center + newRange / 2));
  }, [lowCutoff, highCutoff, maxFreq]);
  */

  const handlePanLeft = useCallback(() => {
    const container = getWsScrollContainer();
    if (container) {
      container.scrollLeft -= 100;
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
    const newZoom = 0;
    ws.zoom(newZoom);
    setWsZoom(newZoom);
    setDrawingBox?.(null);
    requestAnimationFrame(() => updateVisibleTime(newZoom))
  }, [updateVisibleTime, setDrawingBox]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v') { setIsVPressed(true); handlePlayAudio(); }
      if (e.key === 'a') { setIsAPressed(true); handlePanLeft(); }
      if (e.key === 'd') { setIsDPressed(true); handlePanRight(); }
      if (e.key === 'q') { setIsQPressed(true); handleZoomInX(); }
      if (e.key === 'e') { setIsEPressed(true); handleZoomOutX(); }
      // if (e.key === 'w') { setIsQPressed(true); handleFreqZoomIn(); }
      // if (e.key === 'r') { setIsEPressed(true); handleFreqZoomOut(); }
      if (e.key === 'c') { setIsCPressed(true); handleResetView(); }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'v') setIsVPressed(false);
      if (e.key === 'a') setIsAPressed(false);
      if (e.key === 'd') setIsDPressed(false);
      if (e.key === 'q') setIsQPressed(false);
      if (e.key === 'e') setIsEPressed(false);
      // if (e.key === 'w') setIsWPressed(false);
      // if (e.key === 'r') setIsRPressed(false);
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
        ws.on('play', () => setPlaying(true)),
        ws.on('pause', () => setPlaying(false)),
      ];
      return () => unsubs.forEach(fn => fn());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex items-center justify-center gap-2 flex-wrap'>

      <button onClick={handlePlayAudio}
        style={{ backgroundColor: isVPressed ? theme.audioButtonPressed : theme.audioButton, color: theme.buttonsText }}
        onMouseEnter={(e) => !isVPressed && (e.currentTarget.style.backgroundColor = theme.audioButtonHover)}
        onMouseLeave={(e) => !isVPressed && (e.currentTarget.style.backgroundColor = theme.audioButton)}
        className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
        {isPlaying ? 'Pause Audio' : 'Play Audio'}
        <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>V</div>
      </button>

      <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
        <button onClick={handlePanLeft}
          style={{ backgroundColor: isAPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isAPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isAPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Pan Left
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>A</div>
        </button>
        <button onClick={handlePanRight}
          style={{ backgroundColor: isDPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isDPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isDPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Pan Right
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>D</div>
        </button>
      </div>

      <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
        <button onClick={handleZoomInX}
          style={{ backgroundColor: isQPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isQPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isQPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Zoom In (X)
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Q</div>
        </button>
        <button onClick={handleZoomOutX}
          style={{ backgroundColor: isEPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isEPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isEPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Zoom Out (X)
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>E</div>
        </button>


        {/* <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'> */}
        {/* <button onClick={handleFreqZoomIn}
          style={{ backgroundColor: isWPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isWPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isWPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Zoom In (Y)
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>W</div>
        </button>
        <button onClick={handleFreqZoomOut}
          style={{ backgroundColor: isRPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isRPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isRPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Zoom Out (Y)
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>R</div>
        </button> */}


        <button onClick={handleResetView}
          style={{ backgroundColor: isCPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
          onMouseEnter={(e) => !isCPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
          onMouseLeave={(e) => !isCPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Reset View
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>C</div>
        </button>
      </div>
    </div>
  );
}

export default SpectrogramControls;
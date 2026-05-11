import { useState, useEffect, useCallback } from 'react';
import {wavesurferRef} from './WaveformSpectrogram.jsx';
import WaveSurfer from "wavesurfer.js";


function SpectrogramControls({ zoomY, setZoomY }) {
  const ZOOM_STEP = 0.15;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 5;

  const [isVPressed, setIsVPressed] = useState(false);
  const [isAPressed, setIsAPressed] = useState(false);
  const [isDPressed, setIsDPressed] = useState(false);
  const [isWPressed, setIsWPressed] = useState(false);
  const [isSPressed, setIsSPressed] = useState(false);
  const [isQPressed, setIsQPressed] = useState(false);
  const [isEPressed, setIsEPressed] = useState(false);
  const [isRPressed, setIsRPressed] = useState(false);
  const [isFPressed, setIsFPressed] = useState(false);
  const [isCPressed, setIsCPressed] = useState(false);
  
  const [isPlaying, setPlaying] = useState(false);
  const [wsZoom, setWsZoom] = useState(5); // starting px/sec value

 
  const handlePlayAudio  = useCallback(() => {
  wavesurferRef.current?.playPause();
  }, []); 

  
  const handlePanLeft = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    const currentTime = ws.getCurrentTime();
    ws.setTime(Math.max(0, currentTime - 1)); // seek back 1 second
  }, []);

  const handlePanRight = useCallback(() => {
  const ws = wavesurferRef.current;
    if (!ws) return;
    const currentTime = ws.getCurrentTime();
    ws.setTime(Math.min(ws.getDuration(), currentTime + 1)); // seek forward 1 second
  }, []);


// >>>>>>>>>>>>>>>>>>> TBD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handlePanUp = () => console.log("Pan Up");
  const handlePanDown = () => console.log("Pan Down");
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  // Keyboard zoom handler
    const handleZoomInX = useCallback(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;
      const newZoom = Math.min(wsZoom + 20, 500); // cap rn at 500px/sec can be changed later
      ws.zoom(newZoom);
      setWsZoom(newZoom);
    }, [wsZoom]);

    const handleZoomOutX = useCallback(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;
      const newZoom = Math.max(wsZoom - 20, 5); // min display 10px/sec
      ws.zoom(newZoom);
      setWsZoom(newZoom);
    }, [wsZoom]);

    const handleZoomInY = () => console.log("Y zoom in");
    const handleZoomOutY = () => console.log("Y zoom out");
      
    const handleResetView = useCallback(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;
      ws.zoom(5);
      setZoomY(1);
    }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v') { setIsVPressed(true); handlePlayAudio(); }
      if (e.key === 'a') { setIsAPressed(true); handlePanLeft(); }
      if (e.key === 'd') { setIsDPressed(true); handlePanRight(); }
      if (e.key === 'w') { setIsWPressed(true); handlePanUp(); }
      if (e.key === 's') { setIsSPressed(true); handlePanDown(); }
      if (e.key === 'q') { setIsQPressed(true); handleZoomInX(); }
      if (e.key === 'e') { setIsEPressed(true); handleZoomOutX(); }
      if (e.key === 'r') { setIsRPressed(true); handleZoomInY(); }
      if (e.key === 'f') { setIsFPressed(true); handleZoomOutY(); }
      if (e.key === 'c') { setIsCPressed(true); handleResetView(); }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'v') setIsVPressed(false);
      if (e.key === 'a') setIsAPressed(false);
      if (e.key === 'd') setIsDPressed(false);
      if (e.key === 'w') setIsWPressed(false);
      if (e.key === 's') setIsSPressed(false);
      if (e.key === 'q') setIsQPressed(false);
      if (e.key === 'e') setIsEPressed(false);
      if (e.key === 'r') setIsRPressed(false);
      if (e.key === 'f') setIsFPressed(false);
      if (e.key === 'c') setIsCPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);


    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePlayAudio, handlePlayAudio, handlePanLeft, handlePanRight, handleZoomInX, handleZoomOutX, handleResetView]);
  
  useEffect(() => {
    // Poll until wavesurferRef.current is available
    const interval = setInterval(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;

      clearInterval(interval);

      const unsubs = [
        ws.on("play", () => setPlaying(true)),
        ws.on("pause", () => setPlaying(false)),
      ];

      // cleanup stored so we can call it later
      return () => unsubs.forEach(fn => fn());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex items-center justify-center gap-2 flex-wrap'>
      <button onClick={handlePlayAudio} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
        ${isVPressed ? 'bg-[#B4D2EF]' : 'bg-[#CAE4EF] hover:bg-[#B4D2EF]'}`}>
          
          {isPlaying ? 'Pause Audio' : 'Play Audio'}
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>V</div>
      </button>

      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button onClick={handlePanLeft} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isAPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Pan Left
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>A</div>
        </button>
        <button onClick={handlePanRight} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isDPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Pan Right
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>D</div>
        </button>
        <button onClick={handlePanUp} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isWPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Pan Up
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>W</div>
        </button>
        <button onClick={handlePanDown} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isSPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Pan Down
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>S</div>
        </button>
      </div>

      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button onClick={handleZoomInX} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isQPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Zoom In (X)
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Q</div>
        </button>
        <button onClick={handleZoomOutX} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isEPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Zoom Out (X)
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>E</div>
        </button>
        <button onClick={handleZoomInY} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isRPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Zoom In (Y)
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>R</div>
        </button>
        <button onClick={handleZoomOutY} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isFPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Zoom Out (Y)
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>F</div>
        </button>
        <button onClick={handleResetView} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isCPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Reset View
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>C</div>
        </button>
      </div>
    </div>
  );
}

export default SpectrogramControls;
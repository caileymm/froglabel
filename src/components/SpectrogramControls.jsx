import { useState, useEffect, useCallback, scrollRef } from 'react';

function SpectrogramControls({ zoomX, setZoomX, zoomY, setZoomY}) {
  
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
 

  const handlePlayAudio = () => console.log("Play Audio");
  
  const handlePanLeft = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 50;
  }, [scrollRef]);

  const handlePanRight = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 50;
  }, [scrollRef]);

  const handlePanUp = () => console.log("Pan Up");
  const handlePanDown = () => console.log("Pan Down");
  // Keyboard zoom handler
    const handleZoomInX = useCallback(() => {
          setZoomX((z) => Math.min(MAX_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(2))));
      }, [])
    const handleZoomOutX = useCallback(() => {
          setZoomX((z) => Math.max(MIN_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(2))));
      }, [])
    const handleZoomInY = () => console.log("Y zoom in");
    const handleZoomOutY = () => console.log("Y zoom out");
      
    const handleResetView = useCallback(() => {
      setZoomX(1);
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
  }, []);


  
  

  return (
    <div className='p-2 bg-[#82A062] rounded-xl flex items-center justify-center gap-2'>
      <button onClick={handlePlayAudio} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
        ${isVPressed ? 'bg-[#B4D2EF]' : 'bg-[#CAE4EF] hover:bg-[#B4D2EF]'}`}>
        Play Audio
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
import { useState, useEffect, useRef } from 'react';

function BoundingBoxControls({ 
  code, 
  setCode, 
  codesDict, 
  boxes, 
  setBoxes, 
  currSelectedBoxId, 
  setCurrSelectedBoxId, 
  theme 
}) {
  const inputRef = useRef(null);
  const [isError, setIsError] = useState(false);
  
  // Visual state for keyboard shortcuts
  const [pressedKeys, setPressedKeys] = useState({
    space: false,
    tab: false,
    shiftV: false,
    shiftD: false,
    esc: false
  });

  const handleSetCode = () => {
    setCode('');
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const handleCodeInput = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (value.length < 3) { setCode(value); setIsError(false); return; }
    if (value.length === 3) {
      if (Object.keys(codesDict).includes(value)) {
        setCode(value); setIsError(false);
      } else {
        setCode(''); setIsError(true);
        setTimeout(() => setIsError(false), 1000);
      }
      inputRef.current?.blur();
    }
  };

  // Select the next box in the array based on ID
  const handleSelectBox = () => {
    if (boxes.length === 0) {
        setCurrSelectedBoxId(-1);
        return;
    }
    const currentIndex = boxes.findIndex(b => b.id === currSelectedBoxId);
    const nextIndex = (currentIndex + 1) % boxes.length;
    setCurrSelectedBoxId(boxes[nextIndex].id);
  };

  const handlePlayBoxAudio = () => {
    if (currSelectedBoxId !== -1) console.log("Play Box Audio for:", currSelectedBoxId);
  };

  const handleDeleteBox = () => {
    if (currSelectedBoxId !== -1) {
      setBoxes((prev) => prev.filter((box) => box.id !== currSelectedBoxId));
      setCurrSelectedBoxId(-1);
    }
  };

  const handleDeselectBox = () => setCurrSelectedBoxId(-1);

  // Sync refs so the EventListener always sees the newest state without re-binding
  const actionsRef = useRef({ handleSetCode, handleSelectBox, handlePlayBoxAudio, handleDeleteBox, handleDeselectBox });
  useEffect(() => {
    actionsRef.current = { handleSetCode, handleSelectBox, handlePlayBoxAudio, handleDeleteBox, handleDeselectBox };
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if the user is typing in the input
      if (document.activeElement === inputRef.current && e.key !== 'Enter' && e.key !== 'Escape') return;

      if (e.key === ' ') { 
        e.preventDefault(); 
        setPressedKeys(p => ({ ...p, space: true })); 
        actionsRef.current.handleSetCode(); 
      }
      if (e.key === 'Tab') { 
        e.preventDefault(); 
        setPressedKeys(p => ({ ...p, tab: true })); 
        actionsRef.current.handleSelectBox(); 
      }
      if (e.shiftKey && e.key.toUpperCase() === 'V') { 
        e.preventDefault(); 
        setPressedKeys(p => ({ ...p, shiftV: true })); 
        actionsRef.current.handlePlayBoxAudio(); 
      }
      if (e.shiftKey && e.key.toUpperCase() === 'D') { 
        e.preventDefault(); 
        setPressedKeys(p => ({ ...p, shiftD: true })); 
        actionsRef.current.handleDeleteBox(); 
      }
      if (e.key === 'Escape') { 
        setPressedKeys(p => ({ ...p, esc: true })); 
        actionsRef.current.handleDeselectBox(); 
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') setPressedKeys(p => ({ ...p, space: false }));
      if (e.key === 'Tab') setPressedKeys(p => ({ ...p, tab: false }));
      if (e.key === 'Shift' || e.key.toUpperCase() === 'V') setPressedKeys(p => ({ ...p, shiftV: false }));
      if (e.key === 'Shift' || e.key.toUpperCase() === 'D') setPressedKeys(p => ({ ...p, shiftD: false }));
      if (e.key === 'Escape') setPressedKeys(p => ({ ...p, esc: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className='flex items-center justify-center gap-2 flex-wrap'>
      {/* Code Input Group */}
      <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1 font-display'>
        <button onClick={handleSetCode}
          style={{ backgroundColor: pressedKeys.space ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 transition-colors'>
          Set Code
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>Space</div>
        </button>
        <span className="text-gray-400">+</span>
        <input
          ref={inputRef}
          value={code}
          onChange={handleCodeInput}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder='Code'
          maxLength={3}
          className={`w-15 px-2 py-1.5 text-xs rounded-md font-display placeholder-[#B0AF98] uppercase placeholder:normal-case focus:outline-none
            ${isError ? 'ring-2 ring-red-400' : 'border-none'}`}
          style={{ backgroundColor: '#FFFFFF' }}
        />
        <span className="text-gray-400">:</span>
        <div style={{ backgroundColor: theme.cream }} className='px-2 py-1.5 text-xs rounded-md font-display min-w-[60px] text-center'>
          {codesDict[code] || '—'}
        </div>
      </div>

      {/* Box Actions Group */}
      <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
        <button onClick={handleSelectBox}
          style={{ backgroundColor: pressedKeys.tab ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 transition-colors'>
          Select Box
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>Tab</div>
        </button>

        <button onClick={handlePlayBoxAudio}
          style={{ backgroundColor: pressedKeys.shiftV ? theme.audioButtonPressed : theme.audioButton }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 transition-colors'>
          Play Audio
          <div className="flex gap-0.5">
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>Shift</div>
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>V</div>
          </div>
        </button>

        <button onClick={handleDeleteBox}
          style={{ backgroundColor: pressedKeys.shiftD ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 transition-colors'>
          Delete
          <div className="flex gap-0.5">
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>Shift</div>
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>D</div>
          </div>
        </button>

        <button onClick={handleDeselectBox}
          style={{ backgroundColor: pressedKeys.esc ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 transition-colors'>
          Deselect
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-[10px] font-display px-1.5 rounded-md'>Esc</div>
        </button>
      </div>
    </div>
  );
}

export default BoundingBoxControls;
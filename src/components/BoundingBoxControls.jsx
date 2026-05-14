import { useState, useEffect, useRef } from 'react';

function BoundingBoxControls({ code, setCode, codesDict, boxes, setBoxes, currSelectedBox, setCurrSelectedBox, theme }) {
  const inputRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isTabPressed, setIsTabPressed] = useState(false);
  const [isShiftVPressed, setIsShiftVPressed] = useState(false);
  const [isShiftDPressed, setIsShiftDPressed] = useState(false);
  const [isEscPressed, setIsEscPressed] = useState(false);

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

  const handleSelectBox = () => {
    setCurrSelectedBox((prev) => {
      if (boxes.length === 0) return -1;
      return (prev + 1) % boxes.length;
    });
  };
  const handleSelectBoxRef = useRef(handleSelectBox);
  useEffect(() => { handleSelectBoxRef.current = handleSelectBox; });

  const handlePlayBoxAudio = () => console.log("Play Box Audio");

  const handleDeleteBox = () => {
    if (currSelectedBox != -1) {
      setBoxes((prev) => prev.filter((_, i) => i !== currSelectedBox));
      setCurrSelectedBox(-1);
    }
  };
  const handleDeleteBoxRef = useRef(handleDeleteBox);
  useEffect(() => { handleDeleteBoxRef.current = handleDeleteBox; });

  const handleDeselectBox = () => setCurrSelectedBox(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') { e.preventDefault(); setIsSpacePressed(true); handleSetCode(); }
      if (e.key === 'Tab') { e.preventDefault(); setIsTabPressed(true); handleSelectBoxRef.current(); }
      if (e.shiftKey && e.key === 'V') { e.preventDefault(); setIsShiftVPressed(true); handlePlayBoxAudio(); }
      if (e.shiftKey && e.key === 'D') { e.preventDefault(); setIsShiftDPressed(true); handleDeleteBoxRef.current(); }
      if (e.key === 'Escape') { setIsEscPressed(true); handleDeselectBox(); }
    };
    const handleKeyUp = (e) => {
      if (e.key === ' ') setIsSpacePressed(false);
      if (e.key === 'Tab') setIsTabPressed(false);
      if (e.key === 'Shift' || e.key === 'V') setIsShiftVPressed(false);
      if (e.key === 'Shift' || e.key === 'D') setIsShiftDPressed(false);
      if (e.key === 'Escape') setIsEscPressed(false);
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
      <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1 font-display'>
        <button onClick={handleSetCode}
          style={{ backgroundColor: isSpacePressed ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Set Code
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Space</div>
        </button>
        +
        <input
          ref={inputRef}
          value={code}
          onChange={handleCodeInput}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder='Code'
          maxLength={3}
          className={`w-15 px-2 py-1.5 text-xs rounded-md font-display placeholder-[#E6E5C9] uppercase placeholder:normal-case
            ${isError ? 'border-2 border-[#FFAAAA]' : 'border-none'}`}
          style={{ backgroundColor: '#FFFFFF' }}
        />
        :
        <div style={{ backgroundColor: theme.cream }} className='px-2 py-1.5 text-xs rounded-md font-display'>
          {codesDict[code] || '—'}
        </div>
      </div>

      <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
        <button onClick={handleSelectBox}
          style={{ backgroundColor: isTabPressed ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Select Box
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Tab</div>
        </button>
        <button onClick={handlePlayBoxAudio}
          style={{ backgroundColor: isShiftVPressed ? theme.audioButtonPressed : theme.audioButton }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Play Box Audio
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Shift</div>
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>V</div>
        </button>
        <button onClick={handleDeleteBox}
          style={{ backgroundColor: isShiftDPressed ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Delete Box
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Shift</div>
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>D</div>
        </button>
        <button onClick={handleDeselectBox}
          style={{ backgroundColor: isEscPressed ? theme.buttonsPressed : theme.buttons }}
          className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
          Deselect Box
          <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Esc</div>
        </button>
      </div>
    </div>
  );
}

export default BoundingBoxControls;
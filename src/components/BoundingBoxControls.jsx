import commandIcon from '../assets/command.png';
import {useState, useEffect} from 'react';

function BoundingBoxControls() {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isTabPressed, setIsTabPressed] = useState(false);
  const [isShiftVPressed, setIsShiftVPressed] = useState(false);
  const [isShiftDPressed, setIsShiftDPressed] = useState(false);
  const [isEscPressed, setIsEscPressed] = useState(false);
  const [isZPressed, setIsZPressed] = useState(false);
  const [isXPressed, setIsXPressed] = useState(false);

  const handleChangeCode = () => console.log("Changing Code");
  const handleSelectBox = () => console.log("Select Box");
  const handlePlayBoxAudio = () => console.log("Play Box Audio");
  const handleDeleteBox = () => console.log("Delete Box");
  const handleDeselectBox = () => console.log("Deselect Box");
  const handleUndo = () => console.log("Undo");
  const handleRedo = () => console.log("Redo");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') { e.preventDefault(); setIsSpacePressed(true); handleChangeCode(); }
      if (e.key === 'Tab') { e.preventDefault(); setIsTabPressed(true); handleSelectBox(); }
      if (e.shiftKey && e.key == 'V') { e.preventDefault(); setIsShiftVPressed(true); handlePlayBoxAudio(); }
      if (e.shiftKey && e.key == 'D') { e.preventDefault(); setIsShiftDPressed(true); handleDeleteBox(); }
      if (e.key === 'Escape') { setIsEscPressed(true); handleDeselectBox(); }
      if (e.key === 'z') { e.preventDefault(); setIsZPressed(true); handleUndo(); }
      if (e.key === 'x') { e.preventDefault(); setIsXPressed(true); handleRedo(); }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') setIsSpacePressed(false);
      if (e.key === 'Tab') setIsTabPressed(false);
      if (e.key === 'Shift' || e.key === 'V') setIsShiftVPressed(false);
      if (e.key === 'Shift' || e.key === 'D') setIsShiftDPressed(false);
      if (e.key === 'Escape') setIsEscPressed(false);
      if (e.key === 'z') setIsZPressed(false);
      if (e.key === 'x') setIsXPressed(false);
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
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button onClick={handleChangeCode} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 
          ${isSpacePressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Change Code
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Space</div>
        </button>
        +
        <input placeholder='3-Char Code' className='w-22 px-2 py-1.5 text-sm bg-[#FFFFFF] rounded-md font-display placeholder-[#E6E5C9]'/>
      </div>

      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button onClick={handleSelectBox} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isTabPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Select Box
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Tab</div>
        </button>

        <button onClick={handlePlayBoxAudio} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isShiftVPressed ? 'bg-[#B4D2EF]' : 'bg-[#CAE4EF] hover:bg-[#B4D2EF]'}`}>
          Play Box Audio
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Shift</div>
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>V</div>
        </button>

        <button onClick={handleDeleteBox} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isShiftDPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Delete Box
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Shift</div>
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>D</div>
        </button>

        <button onClick={handleDeselectBox} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isEscPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Deselect Box
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Esc</div>
        </button>
      </div>

      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button onClick={handleUndo} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isZPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Undo
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Z</div>
        </button>

        <button onClick={handleRedo} className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isXPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Redo
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>X</div>
        </button>
      </div>
    </div>
  );
}

export default BoundingBoxControls;
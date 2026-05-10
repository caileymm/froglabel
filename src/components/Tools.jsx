import { useState, useEffect, useRef} from 'react';

function BoundingBoxControls() {
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [currTool, setCurrTool] = useState(0);
    const shiftAloneRef = useRef(true);

    const handleChangeTool = () => {
        setCurrTool((prev) => ((prev + 1) % 5));
    }

    const handleChangeToTool0 = () => {
        setCurrTool(0)
    }

    const handleChangeToTool1 = () => {
        setCurrTool(1)
    }

    const handleChangeToTool2 = () => {
        setCurrTool(2)
    }

    const handleChangeToTool3 = () => {
        setCurrTool(3)
    }

    const handleChangeToTool4 = () => {
        setCurrTool(4)
    }

    
    useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Shift') {
        shiftAloneRef.current = true; // assume alone until proven otherwise
        setIsShiftPressed(true);
        } else if (e.shiftKey) {
        shiftAloneRef.current = false; // another key was pressed with Shift
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Shift') {
        if (shiftAloneRef.current) handleChangeTool(); // only cycle if Shift was alone
        setIsShiftPressed(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
    }, []);

  return (
    <div className='p-2 bg-[#82A062] rounded-xl flex items-center justify-center gap-2 mx-auto'>
        <button className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isShiftPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Change Tool
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-xs font-display px-2 rounded-md'>Shift</div>
        </button>
        <div eventHandler={handleChangeToTool0} className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
            <button className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 
                ${currTool == 0 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T0
            </button>

            <button onClick={handleChangeToTool1} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 1 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T2
            </button>

            <button onClick={handleChangeToTool2} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 2 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T3
            </button>

            <button onClick={handleChangeToTool3} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 3 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T4
            </button>

            <button onClick={handleChangeToTool4} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 4 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T5
            </button>
      </div>
    </div>
  );
}

export default BoundingBoxControls;
import { useState, useEffect } from 'react';

function BoundingBoxControls() {
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [currTool, setCurrTool] = useState(0);

    const handleChangeTool = () => {
        setCurrTool((prev) => ((prev + 1) % 5));
    }

    useEffect(() => {
        const handleKeyDown = (e) => { 
        if (e.shiftKey) { e.preventDefault(); setIsShiftPressed(true); handleChangeTool(); }
        };

        const handleKeyUp = (e) => {
        if (e.key === 'Shift') setIsShiftPressed(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

  return (
    <div className='p-2 bg-[#82A062] rounded-xl flex items-center justify-center gap-2 w-90 mx-auto'>
        <button className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
          ${isShiftPressed ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
          Change Tool
          <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md'>Shift</div>
        </button>
        <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
            <button className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1 
                ${currTool == 0 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T1
            </button>

            <button className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 1 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T2
            </button>

            <button className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 2 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T3
            </button>

            <button className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 3 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T4
            </button>

            <button className={`px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 4 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T5
            </button>
      </div>
    </div>
  );
}

export default BoundingBoxControls;
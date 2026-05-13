import { useState, useEffect, useRef} from 'react';
import {wavesurferRef, spectrogramRef} from './WaveformSpectrogram.jsx';

function Tools() {
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [currTool, setCurrTool] = useState(0);
    const [is1Pressed, setIs1Pressed] = useState(false);
    const [is2Pressed, setIs2Pressed] = useState(false);
    const [is3Pressed, setIs3Pressed] = useState(false);
    const [is4Pressed, setIs4Pressed] = useState(false);
    const shiftAloneRef = useRef(true);

    const handleChangeTool = () => {
        setCurrTool((prev) => ((prev + 1) % 5));
    }

    const handleChangeToTool0 = () => {
        setCurrTool(0)
        const ws = wavesurferRef.current;
        if (!ws) return;
    }

    const handleChangeToTool1 = () => {
        setCurrTool(1)
        const ws = wavesurferRef.current;
        if (!ws) return;
    }

    const handleChangeToTool2 = () => {
        setCurrTool(2)
        const ws = wavesurferRef.current;
        if (!ws) return;
    }

    const handleChangeToTool3 = () => {
        setCurrTool(3)
        const ws = wavesurferRef.current;
        if (!ws) return;
    }

    const handleChangeToTool4 = () => {
        setCurrTool(4)
        const ws = wavesurferRef.current;
        if (!ws) return;
    }

    
    useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Shift') {
        shiftAloneRef.current = true; // assume alone until proven otherwise
        setIsShiftPressed(true);
        } else if (e.shiftKey) {
        shiftAloneRef.current = false; // another key was pressed with Shift
        }
        else if (e.key === '1') {setIs1Pressed(true); handleChangeToTool1();}
        else if (e.key === '2') {setIs2Pressed(true); handleChangeToTool2();}
        else if (e.key === '3') {setIs3Pressed(true); handleChangeToTool3();}
        else if (e.key === '4') {setIs4Pressed(true); handleChangeToTool4();}
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Shift') {
        if (shiftAloneRef.current) handleChangeTool(); // only cycle if Shift was alone
        setIsShiftPressed(false);
        }
        else if (e.key === '1') {setIs1Pressed(false);}
        else if (e.key === '2') {setIs2Pressed(false);}
        else if (e.key === '3') {setIs3Pressed(false);}
        else if (e.key === '4') {setIs4Pressed(false);}
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
    }, []);


  return (
    <div className='p-1 bg-[#82A062] rounded-xl flex items-center justify-center gap-2 w-80  mx-auto'>
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
            T1
            </button>

            <button onClick={handleChangeToTool2} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 2 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T2
            </button>

            <button onClick={handleChangeToTool3} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 3 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T3
            </button>

            <button onClick={handleChangeToTool4} className={`px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1
                ${currTool == 4 ? 'bg-[#FFDE9E]' : 'bg-[#FEECBE] hover:bg-[#FFDE9E]'}`}>
            T4
            </button>
      </div>
    </div>
  );
}

export default Tools;
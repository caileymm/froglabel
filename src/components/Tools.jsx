import { useState, useEffect, useRef } from 'react';

function Tools({ currTool, setCurrTool, theme }) {
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const shiftAloneRef = useRef(true);

    const handleChangeTool = () => setCurrTool((prev) => ((prev + 1) % 5));
    const handleChangeToTool0 = () => setCurrTool(0);
    const handleChangeToTool1 = () => setCurrTool(1);
    const handleChangeToTool2 = () => setCurrTool(2);
    const handleChangeToTool3 = () => setCurrTool(3);
    const handleChangeToTool4 = () => setCurrTool(4);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Shift') {
                shiftAloneRef.current = true;
                setIsShiftPressed(true);
            } else if (e.shiftKey) {
                shiftAloneRef.current = false;
            }
        };
        const handleKeyUp = (e) => {
            if (e.key === 'Shift') {
                if (shiftAloneRef.current) handleChangeTool();
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
        <div style={{ backgroundColor: theme.panels }} className='py-2 rounded-xl flex items-center justify-center gap-2 w-80 mx-auto'>
            <button
                style={{ backgroundColor: isShiftPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                Change Tool
                <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Shift</div>
            </button>
            <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
                <button onClick={handleChangeToTool0}
                    style={{ backgroundColor: currTool === 0 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    T1
                </button>
                <button onClick={handleChangeToTool1}
                    style={{ backgroundColor: currTool === 1 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    T2
                </button>
                <button onClick={handleChangeToTool2}
                    style={{ backgroundColor: currTool === 2 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    T3
                </button>
                <button onClick={handleChangeToTool3}
                    style={{ backgroundColor: currTool === 3 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    T4
                </button>
                <button onClick={handleChangeToTool4}
                    style={{ backgroundColor: currTool === 4 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    T5
                </button>
            </div>
        </div>
    );
}

export default Tools;
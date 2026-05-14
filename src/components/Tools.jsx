import { useState, useEffect, useRef, useCallback } from 'react';
import defaultBlack from '../assets/default_black.png';
import defaultWhite from '../assets/default_white.png';
import crosshairBlack from '../assets/crosshair_black.png';
import crosshairWhite from '../assets/crosshair_white.png';
import moonBlack from '../assets/moon_black.png';
import moonWhite from '../assets/moon_white.png';
import { usePanels } from './PanelContext';

function Tools({ currTool, setCurrTool, theme, frogTheme }) {
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const shiftAloneRef = useRef(true);
1
    const { showLeftPanel, setShowLeftPanel, rightPanel, setRightPanel, showDataset, setShowDataset} = usePanels();
     
    useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') setShowLeftPanel(prev => !prev);
      if (e.key === '2') setRightPanel(prev => prev === 2 ? null : 2);
      if (e.key === '3') setRightPanel(prev => prev === 3 ? null : 3);
      if (e.key === '4') setShowDataset(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const { setRightPanel } = usePanels();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '1') handleChangeToTool0();
            if (e.key === '2') handleChangeToTool1();
            if (e.key === '3') handleChangeToTool2();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleChangeToTool0 = () => {
        setCurrTool(0);
        setRightPanel(null);
    };

    const handleChangeToTool1 = () => {
        setCurrTool(1);
        setRightPanel(prev => prev === 2 ? null : 2);
    };

    const handleChangeToTool2 = () => {
        setCurrTool(2);
        setRightPanel(prev => prev === 3 ? null : 3);
    };

    const handleChangeTool = useCallback(
        () => setCurrTool((prev) => ((prev + 1) % 3)),
        []
    );

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
    }, [handleChangeTool]);

    return (
        <div style={{ backgroundColor: theme.panels }} className='py-2 rounded-xl flex items-center justify-center gap-2 w-70 mx-auto'>
            <button
                style={{ backgroundColor: isShiftPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                onMouseEnter={(e) => !isShiftPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                onMouseLeave={(e) => !isShiftPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
                className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                Change Tool
                <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Shift</div>
            </button>
            <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
                <button onClick={handleChangeToTool0}
                    style={{ backgroundColor: currTool === 0 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== 0 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== 0 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? defaultBlack : defaultWhite} className='w-4 h-4' />
                </button>
                <button onClick={handleChangeToTool1}
                    style={{ backgroundColor: currTool === 1 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== 1 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== 1 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? crosshairBlack : crosshairWhite} className='w-4 h-4' />
                </button>
                <button onClick={handleChangeToTool2}
                    style={{ backgroundColor: currTool === 2 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== 2 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== 2 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? moonBlack : moonWhite} className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
}

export default Tools;
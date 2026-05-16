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
    const [nextTool, setnextTool] = useState(false);
    const shiftAloneRef = useRef(true);
    const { showLeftPanel, setShowLeftPanel, rightPanel, setRightPanel, showDataset, setShowDataset} = usePanels();

    const handleChangeToTool1 = () => {
        setCurrTool(0); // Default cursor
        // setShowLeftPanel(prev => !prev); // Toggle CodePanel
    };

    const handleChangeToTool2 = () => {
        setCurrTool(1); // Crosshair cursor
        setRightPanel(prev => prev === 2 ? null : 2); // Toggle BoxFilePanel
    };

    const handleChangeToTool3 = () => {
        setCurrTool(3); // Moon cursor
        setRightPanel(prev => prev === 3 ? null : 3); // Toggle SpectrogramPanel
    };

    const handleChangeToTool4 = () => {
        setShowDataset(prev => !prev); // Toggle DatasetPanel
    };

    const handleChangeTool = useCallback(() => {
        // Cycle through tools: 0 → 1 → 3 → 0
        let nextTool;
        if (currTool === 0) nextTool = 1;
        else if (currTool === 1) nextTool = 3;
        else nextTool = 0;

        // Close current tool's panel if applicable
        if (currTool === 1) setRightPanel(null);
        else if (currTool === 3) setRightPanel(null);

        // Open next tool's panel if applicable
        if (nextTool === 1) setRightPanel(prev => prev === 2 ? null : 2);
        else if (nextTool === 3) setRightPanel(prev => prev === 3 ? null : 3);

        setCurrTool(nextTool);
    }, [currTool]);

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
                onClick={handleChangeTool}
                style={{ backgroundColor: isShiftPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                onMouseEnter={(e) => !isShiftPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                onMouseLeave={(e) => !isShiftPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
                className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                Change Tool
                <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>Shift</div>
            </button>
            <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
                <button onClick={handleChangeToTool1}
                    style={{ backgroundColor: currTool === 0 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== 0 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== 0 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? defaultBlack : defaultWhite} className='w-4 h-4' />
                </button>
                <button onClick={handleChangeToTool2}
                    style={{ backgroundColor: currTool === 1 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== 1 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== 1 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? crosshairBlack : crosshairWhite} className='w-4 h-4' />
                </button>
                <button onClick={handleChangeToTool3}
                    style={{ backgroundColor: currTool === 3 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== 3 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== 3 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? moonBlack : moonWhite} className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
}

export default Tools;
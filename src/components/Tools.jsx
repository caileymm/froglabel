import { useState, useEffect, useRef, useCallback } from 'react';
import defaultBlack from '../assets/default_black.png';
import defaultWhite from '../assets/default_white.png';
import crosshairBlack from '../assets/crosshair_black.png';
import crosshairWhite from '../assets/crosshair_white.png';
import moonBlack from '../assets/moon_black.png';
import moonWhite from '../assets/moon_white.png';
import { usePanels } from './PanelContext';

function Tools({ theme, frogTheme }) {
    const [isTPressed, setIsTPressed] = useState(false);
    const { showLeftPanel, setShowLeftPanel, rightPanel, setRightPanel, showDataset, setShowDataset, currTool, setCurrTool} = usePanels();
    const currToolRef = useRef(currTool);
    useEffect(() => { currToolRef.current = currTool; }, [currTool]);

    const handleChangeToTool1 = () => {
        setCurrTool(0); // Default cursor
        setShowLeftPanel(prev => !prev);
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
    const curr = currToolRef.current;
    let nextTool;
    if (curr === null) nextTool = 0;
    else if (curr === 0) nextTool = 1;
    else if (curr === 1) nextTool = 3;
    else nextTool = null;

    if (curr === 0) setShowLeftPanel(null);
    else if (curr === 1) setRightPanel(null);
    else if (curr === 3) setRightPanel(null);

    if (nextTool === 0) setShowLeftPanel(1);
    else if (nextTool === 1) setRightPanel(2);
    else if (nextTool === 3) setRightPanel(3);

    setCurrTool(nextTool);
}, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
            if (isInputFocused) return;
            if (e.key.toUpperCase() === 'T') {
                setIsTPressed(true);
                handleChangeTool();
            }
            if (e.key === '1') handleChangeToTool1();
            if (e.key === '2') handleChangeToTool2();
            if (e.key === '3') handleChangeToTool3();
            if (e.key === '4') handleChangeToTool4();
        };
        const handleKeyUp = (e) => {
            if (e.key.toUpperCase() === 'T') setIsTPressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleChangeTool]);

    
    useEffect(() => {
    if (rightPanel === null && !showLeftPanel && currTool !== null) {
        setCurrTool(null);
    }
}, [rightPanel, showLeftPanel]);

    return (
        <div style={{ backgroundColor: theme.panels }} className='py-2 rounded-xl flex items-center justify-center gap-2 w-70 mx-auto'>
            <button
                onClick={handleChangeTool}
                style={{ backgroundColor: isTPressed ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                onMouseEnter={(e) => !isTPressed && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                onMouseLeave={(e) => !isTPressed && (e.currentTarget.style.backgroundColor = theme.buttons)}
                className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                Change Tool
                <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-xs font-display px-2 rounded-md'>T</div>
            </button>
            <div style={{ backgroundColor: theme.group }} className='p-1.5 rounded-xl flex items-center gap-1'>
                <button onClick={handleChangeToTool1}
                    style={{ backgroundColor: showLeftPanel ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => !showLeftPanel && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => !showLeftPanel && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? defaultBlack : defaultWhite} className='w-4 h-4' />
                </button>
                <button onClick={handleChangeToTool2}
                    style={{ backgroundColor: rightPanel === 2 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => rightPanel !== 2 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => rightPanel !== 2 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? crosshairBlack : crosshairWhite} className='w-4 h-4' />
                </button>
                <button onClick={handleChangeToTool3}
                    style={{ backgroundColor: rightPanel === 3 ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => rightPanel !== 3 && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => rightPanel !== 3 && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? moonBlack : moonWhite} className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
}

export default Tools;
import { useState, useEffect, useRef, useCallback } from 'react';
import defaultBlack from '../assets/default_black.png';
import defaultWhite from '../assets/default_white.png';
import crosshairBlack from '../assets/crosshair_black.png';
import crosshairWhite from '../assets/crosshair_white.png';
import moonBlack from '../assets/moon_black.png';
import moonWhite from '../assets/moon_white.png';
import { usePanels } from './PanelContext';

// Tool numbers match panel badges: tool 1 = default, tool 2 = crosshair/box file, tool 3 = moon/spectrogram
const TOOL_DEFAULT = 1;
const TOOL_CROSSHAIR = 2;
const TOOL_SPECTRO = 3;

const PANEL_BOX_FILE = 2;
const PANEL_SPECTROGRAM = 3;

function Tools({ theme, frogTheme }) {
    const [isTPressed, setIsTPressed] = useState(false);
    const { setShowLeftPanel, setRightPanel, setShowDataset, currTool, setCurrTool } = usePanels();
    const currToolRef = useRef(currTool);
    useEffect(() => { currToolRef.current = currTool; }, [currTool]);

    // Keys 1/2/3 — panels only, never change currTool
    const handleOpenCodePanel = () => {
        setShowLeftPanel(prev => !prev);
    };

    const handleOpenBoxFilePanel = () => {
        setRightPanel(prev => prev === PANEL_BOX_FILE ? null : PANEL_BOX_FILE);
    };

    const handleOpenSpectrogramPanel = () => {
        setRightPanel(prev => prev === PANEL_SPECTROGRAM ? null : PANEL_SPECTROGRAM);
    };

    const handleChangeToTool4 = () => {
        setShowDataset(prev => !prev);
    };

    // Icon buttons + T — select tool; tools 2 & 3 also open their panel
    const applyTool = useCallback((tool) => {
        if (tool === TOOL_DEFAULT) {
            setCurrTool(TOOL_DEFAULT);
            setRightPanel(null);
        } else if (tool === TOOL_CROSSHAIR) {
            setCurrTool(TOOL_CROSSHAIR);
            setShowLeftPanel(false);
            setRightPanel(PANEL_BOX_FILE);
        } else if (tool === TOOL_SPECTRO) {
            setCurrTool(TOOL_SPECTRO);
            setShowLeftPanel(false);
            setRightPanel(PANEL_SPECTROGRAM);
        } else {
            setCurrTool(null);
            setRightPanel(null);
        }
    }, [setCurrTool, setRightPanel, setShowLeftPanel]);

    const handleChangeTool = useCallback(() => {
        const curr = currToolRef.current;
        let nextTool;
        if (curr === TOOL_DEFAULT) nextTool = TOOL_CROSSHAIR;
        else if (curr === TOOL_CROSSHAIR) nextTool = TOOL_SPECTRO;
        else nextTool = TOOL_DEFAULT;

        applyTool(nextTool);
    }, [applyTool]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
            if (isInputFocused) return;
            if (e.key.toUpperCase() === 'T') {
                setIsTPressed(true);
                handleChangeTool();
            }
            if (e.key === '1') handleOpenCodePanel();
            if (e.key === '2') handleOpenBoxFilePanel();
            if (e.key === '3') handleOpenSpectrogramPanel();
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

    return (
        <div style={{ backgroundColor: theme.panels }} className='py-2 rounded-xl flex items-center justify-center gap-2 w-60 mx-auto'>
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
                <button onClick={() => applyTool(TOOL_DEFAULT)}
                    style={{ backgroundColor: currTool === TOOL_DEFAULT ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== TOOL_DEFAULT && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== TOOL_DEFAULT && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? defaultBlack : defaultWhite} className='w-4 h-4' />
                </button>
                <button onClick={() => applyTool(TOOL_CROSSHAIR)}
                    style={{ backgroundColor: currTool === TOOL_CROSSHAIR ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== TOOL_CROSSHAIR && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== TOOL_CROSSHAIR && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? crosshairBlack : crosshairWhite} className='w-4 h-4' />
                </button>
                <button onClick={() => applyTool(TOOL_SPECTRO)}
                    style={{ backgroundColor: currTool === TOOL_SPECTRO ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                    onMouseEnter={(e) => currTool !== TOOL_SPECTRO && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                    onMouseLeave={(e) => currTool !== TOOL_SPECTRO && (e.currentTarget.style.backgroundColor = theme.buttons)}
                    className='px-2 py-1.5 text-xs rounded-md font-display whitespace-nowrap cursor-pointer flex items-center gap-1'>
                    <img src={frogTheme ? moonBlack : moonWhite} className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
}

export default Tools;

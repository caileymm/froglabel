import { useOptimistic, useState, useEffect } from 'react';
import { usePanels } from './PanelContext';


function SpectrogramPanel({ theme }) {
    const [fftSize, setFftSize] = useState('1024');
    const [hopSize, setHopSize] = useState('512');
    


    const { brightness, setBrightness} = usePanels(); 
    const { contrast, setContrast } = usePanels();
    const { colorScale, setColorScale } = usePanels();
    const { FFTSamples, setFFTSamples } = usePanels();
    const { windowFunction, setWindowFunction } = usePanels();
    const { overlap, setOverlap } = usePanels();
    const {minFreq, setMinFreq} = usePanels();
    const {maxFreq, setMaxFreq} = usePanels();
    const {modifyBandPass,setModifyBandPass} = usePanels();
    const {lowCutoff, setLowCutoff} = usePanels();
    const {highCutoff, setHighCutoff} = usePanels();
    const [pendingLow, setPendingLow] = useState(lowCutoff);
    const [pendingHigh, setPendingHigh] = useState(highCutoff);


    // Sync pending when context values change (e.g. on new audio load)
    useEffect(() => { setPendingLow(lowCutoff); }, [lowCutoff]);
    useEffect(() => { setPendingHigh(highCutoff); }, [highCutoff]);

    const colorScales = [
        { name: 'roseus',  gradient: 'linear-gradient(to right, #dbc642, #f36e1c, #d94f8a, #7a1b6c, #2b0a3d )',dbfs: [-120, -90, -60, -30, 0]},
        { name: 'igray',  gradient: 'linear-gradient(to right, #ffffff, #000000 ', dbfs: [-120, -90, -60, -30, 0] },
        { name: 'gray',   gradient: 'linear-gradient(to right, #000000, #ffffff)',                   dbfs: [-120, -90, -60, -30, 0] },
    ];
        
    const selected = colorScales.find(c => c.name === colorScale) || colorScales[0];

    // Dynamic styles based on theme
    const boxClass = 'rounded-md px-2 py-0.5 font-display text-sm inline-block self-start';
    const rowClass = 'flex flex-row items-center gap-1';
    const headerClass = 'font-display text-sm';
    const unitClass = 'font-display text-sm';
    const inputClass = 'bg-transparent font-display text-sm outline-none w-16';


    const handleColorScaleChange = (name) => {setColorScale(name)}; 
    
    const handleBandPassFilter = () => {
        setLowCutoff(pendingLow);
        setHighCutoff(pendingHigh);
        setModifyBandPass(true);
    };

    const handleRemoveBandPassFilter = () => {
        setLowCutoff(0);
        setHighCutoff(maxFreq);
        setModifyBandPass(true); 
    }



    return (
        <div className='flex flex-col gap-2'>
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-sm font-display px-2 rounded-md w-6 flex items-center justify-center'>3</div>

            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                FFT
                <div className='flex gap-1'>
                    <button
                        onClick={() => setFFTSamples(512)}
                        style={{ backgroundColor: (FFTSamples==512) ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                        onMouseEnter={(e) => !(FFTSamples==512) && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                        onMouseLeave={(e) => !(FFTSamples==512) && (e.currentTarget.style.backgroundColor = theme.buttons)}
                        className='px-1.5 py-2 text-xs rounded-md font-display cursor-pointer'>
                        512
                    </button>
                    <button
                        onClick={() => setFFTSamples(1024)}
                        style={{ backgroundColor: (FFTSamples==1024) ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                        onMouseEnter={(e) => !(FFTSamples==1024) && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                        onMouseLeave={(e) => !(FFTSamples==1024) && (e.currentTarget.style.backgroundColor = theme.buttons)}
                        className='px-1.5 py-2 text-xs rounded-md font-display cursor-pointer'>
                        1024
                    </button>
                    <button
                        onClick={() => setFFTSamples(2048)}
                        style={{ backgroundColor: (FFTSamples==2048) ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                        onMouseEnter={(e) => !(FFTSamples==2048)&& (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                        onMouseLeave={(e) => !(FFTSamples==2048) && (e.currentTarget.style.backgroundColor = theme.buttons)}
                        className='px-1.5 py-2 text-xs rounded-md font-display cursor-pointer'>
                        2048
                    </button>
                    <button
                        onClick={() => setFFTSamples(4096)}
                        style={{ backgroundColor: (FFTSamples==4096) ? theme.buttonsPressed : theme.buttons, color: theme.buttonsText }}
                        onMouseEnter={(e) => !(FFTSamples==4096) && (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                        onMouseLeave={(e) => !(FFTSamples==4096)&& (e.currentTarget.style.backgroundColor = theme.buttons)}
                        className='px-1.5 py-2 text-xs rounded-md font-display cursor-pointer'>
                        4096
                    </button>
                </div>
            </div>

            <div
                style={{ backgroundColor: theme.group, color: theme.text }}
                className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'
            >
                Window Function

                <div className='flex flex-col gap-1'>
                    <button
                        onClick={() => setWindowFunction('hann')}
                        style={{
                            backgroundColor:
                                windowFunction === 'hann'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'hann' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'hann' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Hann
                    </button>

                    <button
                        onClick={() => setWindowFunction('hamming')}
                        style={{
                            backgroundColor:
                                windowFunction === 'hamming'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'hamming' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'hamming' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Hamming
                    </button>

                    <button
                        onClick={() => setWindowFunction('blackman')}
                        style={{
                            backgroundColor:
                                windowFunction === 'blackman'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'blackman' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'blackman' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Blackman
                    </button>
                    <button
                        onClick={() => setWindowFunction('bartlett')}
                        style={{
                            backgroundColor:
                                windowFunction === 'bartlett'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'bartlett' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'bartlett' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Bartlett
                    </button>
                    <button
                        onClick={() => setWindowFunction('cosine')}
                        style={{
                            backgroundColor:
                                windowFunction === 'cosine'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'cosine' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'cosine' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Cosine
                    </button>
                    <button
                        onClick={() => setWindowFunction('gauss')}
                        style={{
                            backgroundColor:
                                windowFunction === 'gauss'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'gauss' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'gauss' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Gauss
                    </button>
                    <button
                        onClick={() => setWindowFunction('lanczoz')}
                        style={{
                            backgroundColor:
                                windowFunction === 'lanczoz'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'lanczoz' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'lanczoz' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Lanczoz
                    </button>
                    <button
                        onClick={() => setWindowFunction('rectangular')}
                        style={{
                            backgroundColor:
                                windowFunction === 'rectangular'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'rectangular' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'rectangular' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Rectangular
                    </button>
                     <button
                        onClick={() => setWindowFunction('triangular')}
                        style={{
                            backgroundColor:
                                windowFunction === 'triangular'
                                    ? theme.buttonsPressed
                                    : theme.buttons,
                            color: theme.buttonsText
                        }}
                        onMouseEnter={(e) =>
                            windowFunction !== 'triangular' &&
                            (e.currentTarget.style.backgroundColor = theme.buttonsHover)
                        }
                        onMouseLeave={(e) =>
                            windowFunction !== 'triangular' &&
                            (e.currentTarget.style.backgroundColor = theme.buttons)
                        }
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'
                    >
                        Triangular
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-3'>
                <span className={headerClass} style={{ color: theme.text }}>
                    Overlap
                </span>

                {/* Overlap */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm'>Overlap</span>
                        <span className='text-sm'>
                            {overlap} %
                        </span>
                    </div>

                    <input
                        type='range'
                        min='0'
                        max='100'
                        step='1'
                        value={overlap} 
                        onChange={e => setOverlap( e.target.value)}
                        className='w-full cursor-pointer'
                    />
            </div>
            </div>


            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-3'>
                <span className={headerClass} style={{ color: theme.text }}>
                    Brightness & Contrast
                </span>

                {/* Brightness */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm'>Brightness</span>
                        <span className='text-sm'>
                            {typeof brightness === 'number'
                                ? brightness.toFixed(2)
                                : brightness}
                        </span>
                    </div>

                    <input
                        type='range'
                        min='0'
                        max='5'
                        step='0.01'
                        value={brightness}
                        onChange={e => setBrightness(parseFloat(e.target.value))}
                        className='w-full cursor-pointer'
                    />
                </div>

                {/* Contrast */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm'>Contrast</span>
                        <span className='text-sm'>
                            {typeof contrast === 'number'
                                ? contrast.toFixed(2)
                                : contrast}
                        </span>
                    </div>

                    <input
                        type='range'
                        min='0'
                        max='5'
                        step='0.01'
                        value={contrast}
                        onChange={e => setContrast(parseFloat(e.target.value))}
                        className='w-full cursor-pointer'
                    />

                </div>
                {/* Reset Button */}
                <button
                    onClick={() => {
                        setBrightness(1);
                        setContrast(1);
                    }}
                    style={{
                        backgroundColor: theme.keyButtons,
                        color: theme.background
                    }}
                    className='rounded-md py-1 mt-1 hover:opacity-90'
                >
                    Reset
                </button>
                
            </div>

            <div
                style={{ backgroundColor: theme.group, color: theme.text }}
                className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-3'
            >
                <span className={headerClass}>Band-Pass Filter</span>

                {/* Low Cutoff */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm'>Low Cutoff</span>
                        <span className='text-sm'>{pendingLow} Hz</span>
                    </div>
                    <input
                        type='range'
                        min={0}
                        max={maxFreq}
                        step='50'
                        value={pendingLow}
                        onChange={(e) => setPendingLow(Number(e.target.value))}
                        className='w-full cursor-pointer'
                    />
                </div>

                {/* High Cutoff */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm'>High Cutoff</span>
                        <span className='text-sm'>{pendingHigh} Hz</span>
                    </div>
                    <input
                        type='range'
                        min={0}
                        max={maxFreq}
                        step='50'
                        value={pendingHigh}
                        onChange={(e) => setPendingHigh(Number(e.target.value))}
                        className='w-full cursor-pointer'
                    />
                </div>
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={handleBandPassFilter}
                        style={{ backgroundColor: theme.keyButtons, color: theme.background }}
                        className='flex-1 rounded-md mt-1 hover:opacity-90'
                    >
                        Apply 
                    </button>
                    <button
                        onClick={handleRemoveBandPassFilter}
                        style={{ backgroundColor: theme.keyButtons, color: theme.background }}
                        className='flex-1 rounded-md mt-1 hover:opacity-90'
                    >
                        Remove 
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Color Scale & dBFS
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <span className={headerClass} style={{ color: theme.text }}>Color Scale</span>
                        {colorScales.map(({ name, gradient }) => (
                            <div
                                key={name}
                                onClick={() => {
                                                handleColorScaleChange(name); }}
                                className='flex flex-row items-center gap-2 cursor-pointer'>
                                <div style={{ borderColor: theme.keyButtons }} className='w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0'>
                                    {colorScale === name && (
                                        <div style={{ backgroundColor: theme.keyButtons }} className='w-2 h-2 rounded-full'/>
                                    ) }
                                </div>
                                <div className='h-4 rounded-sm flex-1' style={{ background: gradient }}/>
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col gap-0.5'>
                        <span className={headerClass} style={{ color: theme.text }}>dBFS</span>
                        <div className='h-4 rounded-sm w-full' style={{ background: selected.gradient }}/>
                        <div className='flex flex-row justify-between'>
                            {selected.dbfs.map(val => (
                                <span key={val} className='font-display text-xs' style={{ color: theme.text }}>{val}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpectrogramPanel;
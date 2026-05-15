import { useState } from 'react';
import { usePanels } from './PanelContext';


function SpectrogramPanel({ theme }) {
    const [fftSize, setFftSize] = useState('1024');
    const [hopSize, setHopSize] = useState('512');
    const [minFreq, setMinFreq] = useState('0');
    const [maxFreq, setMaxFreq] = useState('22050');
    const [lowCutoff, setLowCutoff] = useState(800);
    const [highCutoff, setHighCutoff] = useState(4000);     
    
    const [colorScale, setColorScale] = useState('viridis');

    const { brightness, setBrightness, contrast, setContrast } = usePanels();


    const colorScales = [
        { name: 'viridis', gradient: 'linear-gradient(to right, #440154, #31688e, #35b779, #fde725)', dbfs: [-120, -90, -60, -30, 0] },
        { name: 'magma',   gradient: 'linear-gradient(to right, #000004, #7b2d8b, #f96d3a, #fcfdbf)', dbfs: [-120, -90, -60, -30, 0] },
        { name: 'inferno', gradient: 'linear-gradient(to right, #000004, #7c0c42, #f57d15, #fcffa4)', dbfs: [-120, -90, -60, -30, 0] },
        { name: 'plasma',  gradient: 'linear-gradient(to right, #0d0887, #a632a8, #f89441, #f0f921)', dbfs: [-120, -90, -60, -30, 0] },
        { name: 'greys',   gradient: 'linear-gradient(to right, #000000, #ffffff)',                   dbfs: [-120, -90, -60, -30, 0] },
    ];

    const selected = colorScales.find(c => c.name === colorScale);

    // Dynamic styles based on theme
    const boxClass = 'rounded-md px-2 py-0.5 font-display text-sm inline-block self-start';
    const rowClass = 'flex flex-row items-center gap-1';
    const headerClass = 'font-display text-sm';
    const unitClass = 'font-display text-sm';
    const inputClass = 'bg-transparent font-display text-sm outline-none w-16';


    const handleColorScaleChange = () => {}; 



    return (
        <div className='flex flex-col gap-2'>
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>3</div>

            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                FFT & Hop Size
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass} style={{ color: theme.text }}>FFT Size</span>
                        <div className={rowClass}>
                            <div className={boxClass} style={{ backgroundColor: theme.cream }}>
                                <input value={fftSize} onChange={e => setFftSize(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass} style={{ color: theme.text }}/>
                            </div>
                            <span className={unitClass} style={{ color: theme.text }}>samples</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass} style={{ color: theme.text }}>Hop Size</span>
                        <div className={rowClass}>
                            <div className={boxClass} style={{ backgroundColor: theme.cream }}>
                                <input value={hopSize} onChange={e => setHopSize(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass} style={{ color: theme.text }}/>
                            </div>
                            <span className={unitClass} style={{ color: theme.text }}>samples</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Frequency Limits
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass} style={{ color: theme.text }}>Min Frequency</span>
                        <div className={rowClass}>
                            <div className={boxClass} style={{ backgroundColor: theme.cream }}>
                                <input value={minFreq} onChange={e => setMinFreq(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass} style={{ color: theme.text }}/>
                            </div>
                            <span className={unitClass} style={{ color: theme.text }}>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass} style={{ color: theme.text }}>Max Frequency</span>
                        <div className={rowClass}>
                            <div className={boxClass} style={{ backgroundColor: theme.cream }}>
                                <input value={maxFreq} onChange={e => setMaxFreq(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass} style={{ color: theme.text }}/>
                            </div>
                            <span className={unitClass} style={{ color: theme.text }}>Hz</span>
                        </div>
                    </div>
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
                            <span className='text-sm'>{lowCutoff} Hz</span>
                        </div>

                        <input
                        type='range'
                        min='0'
                        max='12000'
                        step='50'
                        value={lowCutoff}
                        onChange={(e) => setLowCutoff(Number(e.target.value))}
                        className='w-full cursor-pointer'
                        />
                </div>

                {/* High Cutoff */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm'>High Cutoff</span>
                        <span className='text-sm'>{highCutoff} Hz</span>
                    </div>

                    <input
                        type='range'
                        min='0'
                        max='12000'
                        step='50'
                        value={highCutoff}
                        onChange={(e) => setHighCutoff(Number(e.target.value))}
                        className='w-full cursor-pointer'
                    />
                </div>

                {/* Optional Apply Button */}
                <button style={{ backgroundColor: theme.keyButtons, color: theme.background }} className='rounded-md py-1 mt-1 hover:opacity-90'>
                    Apply Filter
                </button>
            </div>

            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Color Scale & dBFS
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <span className={headerClass} style={{ color: theme.text }}>Color Scale</span>
                        {colorScales.map(({ name, gradient }) => (
                            <div
                                key={name}
                                onClick={() => {setColorScale(name); 
                                                // console.log(colorScale);
                                                handleColorScaleChange(); }}
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
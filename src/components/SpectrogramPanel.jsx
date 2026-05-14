import { useState } from 'react';
import { usePanels } from './PanelContext';


function SpectrogramPanel() {
    const [fftSize, setFftSize] = useState('1024');
    const [hopSize, setHopSize] = useState('512');
    const [minFreq, setMinFreq] = useState('0');
    const [maxFreq, setMaxFreq] = useState('22050');
    
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

    const boxClass = 'bg-[#F3F3E4] rounded-md px-2 py-0.5 font-display text-sm inline-block self-start';
    const rowClass = 'flex flex-row items-center gap-1';
    const headerClass = 'font-display text-sm text-[#1E1E1E]';
    const unitClass = 'font-display text-sm';
    const inputClass = 'bg-transparent font-display text-sm outline-none w-16';



    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>3</div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                FFT & Hop Size
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass}>FFT Size</span>
                        <div className={rowClass}>
                            <div className={boxClass}>
                                <input value={fftSize} onChange={e => setFftSize(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass}/>
                            </div>
                            <span className={unitClass}>samples</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Hop Size</span>
                        <div className={rowClass}>
                            <div className={boxClass}>
                                <input value={hopSize} onChange={e => setHopSize(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass}/>
                            </div>
                            <span className={unitClass}>samples</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Frequency Limits
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Min Frequency</span>
                        <div className={rowClass}>
                            <div className={boxClass}>
                                <input value={minFreq} onChange={e => setMinFreq(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass}/>
                            </div>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Max Frequency</span>
                        <div className={rowClass}>
                            <div className={boxClass}>
                                <input value={maxFreq} onChange={e => setMaxFreq(e.target.value)} onKeyDown={e => e.stopPropagation()} className={inputClass}/>
                            </div>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Brightness & Contrast
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Brightness</span>
                        <div className={rowClass}>
                            <div className={boxClass}>
                                <input value={typeof brightness === 'number' ? brightness.toFixed(2) : brightness} onChange={e => setBrightness(parseFloat(e.target.value) || 1)} onKeyDown={e => e.stopPropagation()} className={inputClass}/>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Contrast</span>
                        <div className={rowClass}>
                            <div className={boxClass}>
                                <input value={typeof contrast === 'number' ? contrast.toFixed(2) : contrast} onChange={e => setContrast(parseFloat(e.target.value) || 1)}
 className={inputClass}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Color Scale & dBFS
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <span className={headerClass}>Color Scale</span>
                        {colorScales.map(({ name, gradient }) => (
                            <div
                                key={name}
                                onClick={() => setColorScale(name)}
                                className='flex flex-row items-center gap-2 cursor-pointer'>
                                <div className='w-4 h-4 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center flex-shrink-0'>
                                    {colorScale === name && (
                                        <div className='w-2 h-2 rounded-full bg-[#1E1E1E]'/>
                                    )}
                                </div>
                                <div className='h-4 rounded-sm flex-1' style={{ background: gradient }}/>
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col gap-0.5'>
                        <span className={headerClass}>dBFS</span>
                        <div className='h-4 rounded-sm w-full' style={{ background: selected.gradient }}/>
                        <div className='flex flex-row justify-between'>
                            {selected.dbfs.map(val => (
                                <span key={val} className='font-display text-xs text-[#1E1E1E]'>{val}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpectrogramPanel;
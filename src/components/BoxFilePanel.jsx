import greenAudio from '../assets/green_tree.mp3';
import peronsAudio from '../assets/perons_tree.mp3';
import redEyedAudio from '../assets/red_eyed_tree.mp3';
import { getAudioInfo } from '../utils/audioInfo';
import { useEffect, useState } from 'react';

const audioFiles = [
    { filename: 'green_tree.mp3', audio: greenAudio },
    { filename: 'perons_tree.mp3', audio: peronsAudio },
    { filename: 'red_eyed_tree.mp3', audio: redEyedAudio },
];

function BoxFilePanel({ selectedRow, drawingRow, selectedAudio, setSelectedAudio }) {
    const box = drawingRow ?? selectedRow;

    const label     = box?.code      ?? '—';
    const startTime = box?.startTime ?? '—';
    const endTime   = box?.endTime   ?? '—';
    const duration  = box?.duration  ?? '—';
    const startFreq = box?.startFreq ?? '—';
    const endFreq   = box?.endFreq   ?? '—';
    const bandwidth = box?.bandwidth ?? '—';

    const [info, setInfo] = useState(null);

    useEffect(() => {
    getAudioInfo(selectedAudio).then(info => {
        console.log('audio changed, new info:', info);
        setInfo(info);
    });
}, [selectedAudio]);

    const currentFilename = audioFiles.find(f => f.audio === selectedAudio)?.filename ?? '—';

    const boxClass    = 'bg-[#F3F3E4] rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start';
    const rowClass    = 'flex flex-row items-center gap-1';
    const headerClass = 'font-display text-sm text-[#1E1E1E]';
    const unitClass   = 'font-display text-xs';

    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>2</div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Box Details
                <div className='flex flex-col gap-1'>
                    {[
                        ['Label', label, ''],
                        ['Start Time', startTime, 's'],
                        ['End Time', endTime, 's'],
                        ['Duration', duration, 's'],
                        ['Start Frequency', startFreq, 'Hz'],
                        ['End Frequency', endFreq, 'Hz'],
                        ['Bandwidth', bandwidth, 'Hz'],
                    ].map(([header, value, unit]) => (
                        <div key={header} className='flex flex-col'>
                            <span className={headerClass}>{header}</span>
                            <div className={rowClass}>
                                <span className={boxClass}>{value}</span>
                                {unit && <span className={unitClass}>{unit}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                File Details
                <div className='flex flex-col gap-1'>
                    <span className={headerClass}>Select Audio</span>
                    {audioFiles.map(({ filename, audio }) => (
                        <div
                            key={filename}
                            onClick={() => setSelectedAudio(audio)}
                            className='flex flex-row items-center gap-2 cursor-pointer'
                        >
                            <div className='w-4 h-4 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center flex-shrink-0'>
                                {selectedAudio === audio && <div className='w-2 h-2 rounded-full bg-[#1E1E1E]' />}
                            </div>
                            <span className={boxClass}>{filename}</span>
                        </div>
                    ))}
                    {/*
                    <div className='flex flex-col'>
                        <span className={headerClass}>Filename</span>
                        <div className={rowClass}><span className={boxClass}>{currentFilename}</span></div>
                    </div>
                    */}
                    <div className='flex flex-col'>
                        <span className={headerClass}>Sample Rate</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{info?.sampleRate ?? '—'}</span>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Channels</span>
                        <div className={rowClass}><span className={boxClass}>{info?.channels ?? '—'}</span></div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Bit Rate</span>
                        <div className={rowClass}><span className={boxClass}>{info?.bitrate ?? '—'}</span></div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Version</span>
                        <div className={rowClass}><span className={boxClass}>{info?.version ?? '—'}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoxFilePanel;
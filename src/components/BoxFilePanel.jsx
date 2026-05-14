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

function BoxFilePanel({ selectedRow, drawingRow, selectedAudio, setSelectedAudio, theme }) {
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
            setInfo(info);
        });
    }, [selectedAudio]);

    return (
        <div className='flex flex-col gap-2'>
            <div style={{ backgroundColor: theme.keyButtons, color: theme.keyText }} className='text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>2</div>

            {/* Added style here */}
            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
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
                            <span style={{ color: theme.text }} className='font-display text-sm'>{header}</span>
                            <div className='flex flex-row items-center gap-1'>
                                <span style={{ backgroundColor: theme.cream, color: theme.textInputText }} className='rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start'>{value}</span>
                                {unit && <span style={{ color: theme.text }} className='font-display text-xs'>{unit}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Added style here */}
            <div style={{ backgroundColor: theme.group, color: theme.text }} className='flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                File Details
                <div className='flex flex-col gap-1'>
                    <span style={{ color: theme.text }} className='font-display text-sm'>Select Audio</span>
                    {audioFiles.map(({ filename, audio }) => (
                        <div
                            key={filename}
                            onClick={() => setSelectedAudio(audio)}
                            className='flex flex-row items-center gap-2 cursor-pointer'
                        >
                            <div style={{ borderColor: theme.keyButtons }} className='w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0'>
                                {selectedAudio === audio && <div style={{ backgroundColor: theme.keyButtons }} className='w-2 h-2 rounded-full' />}
                            </div>
                            <span style={{ backgroundColor: theme.cream, color: theme.textInputText }} className='rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start'>{filename}</span>
                        </div>
                    ))}
                    <div className='flex flex-col'>
                        <span style={{ color: theme.text }} className='font-display text-sm'>Sample Rate</span>
                        <div className='flex flex-row items-center gap-1'>
                            <span style={{ backgroundColor: theme.cream, color: theme.textInputText }} className='rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start'>{info?.sampleRate ?? '—'}</span>
                            <span style={{ color: theme.text }} className='font-display text-xs'>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span style={{ color: theme.text }} className='font-display text-sm'>Channels</span>
                        <div className='flex flex-row items-center gap-1'>
                            <span style={{ backgroundColor: theme.cream, color: theme.textInputText }} className='rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start'>{info?.channels ?? '—'}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span style={{ color: theme.text }} className='font-display text-sm'>Bit Rate</span>
                        <div className='flex flex-row items-center gap-1'>
                            <span style={{ backgroundColor: theme.cream, color: theme.textInputText }} className='rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start'>{info?.bitrate ?? '—'}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span style={{ color: theme.text }} className='font-display text-sm'>Version</span>
                        <div className='flex flex-row items-center gap-1'>
                            <span style={{ backgroundColor: theme.cream, color: theme.textInputText }} className='rounded-sm px-2 py-0.5 font-display text-sm inline-block self-start'>{info?.version ?? '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoxFilePanel;
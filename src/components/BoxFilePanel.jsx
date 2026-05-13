import { sampleRate, channels, bitrate, version } from '../utils/audioInfo';

function BoxFilePanel({ selectedRow, drawingRow }) {
    const box = drawingRow ?? selectedRow;

    const label     = box?.code      ?? '—';
    const startTime = box?.startTime ?? '—';
    const endTime   = box?.endTime   ?? '—';
    const duration  = box?.duration  ?? '—';
    const startFreq = box?.startFreq ?? '—';
    const endFreq   = box?.endFreq   ?? '—';
    const bandwidth = box?.bandwidth ?? '—';

    const filename      = 'audio.mp3';

    const boxClass    = 'bg-[#F3F3E4] rounded-md px-2 py-0.5 font-display text-sm inline-block self-start';
    const rowClass    = 'flex flex-row items-center gap-1';
    const headerClass = 'font-display text-sm text-[#1E1E1E]';
    const unitClass   = 'font-display text-xs';

    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>2</div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Box Details
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Label</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{label}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Start Time</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{startTime}</span>
                            <span className={unitClass}>s</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>End Time</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{endTime}</span>
                            <span className={unitClass}>s</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Duration</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{duration}</span>
                            <span className={unitClass}>s</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Start Frequency</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{startFreq}</span>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>End Frequency</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{endFreq}</span>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Bandwidth</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{bandwidth}</span>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                File Details
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Filename</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{filename}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Sample Rate</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{sampleRate}</span>
                            <span className={unitClass}>Hz</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Channels</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{channels}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Bit Rate</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{bitrate}</span>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <span className={headerClass}>Version</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{version}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoxFilePanel;
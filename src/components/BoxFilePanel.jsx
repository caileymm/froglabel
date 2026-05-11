function BoxFilePanel() {
    const label = 'Label1';
    const startTime = '1.23';
    const endTime = '2.45';
    const duration = '1.22';
    const startFreq = '1200';
    const endFreq = '4800';
    const bandwidth = '3600';

    const filename = 'recording_001.wav';
    const sampleRate = '44100';
    const recordingDate = '2024-03-15';
    const recordingTime = '08:32:11';

    const boxClass = 'bg-[#F3F3E4] rounded-md px-2 py-0.5 font-display text-sm inline-block self-start';
    const rowClass = 'flex flex-row items-center gap-1';
    const headerClass = 'font-display text-sm text-[#1E1E1E]';
    const unitClass = 'font-display text-sm';

    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>2</div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Box Info
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
                File Info
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
                        <span className={headerClass}>Recording Date</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{recordingDate}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className={headerClass}>Recording Time</span>
                        <div className={rowClass}>
                            <span className={boxClass}>{recordingTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoxFilePanel;
import { useState } from 'react';

function DatasetPanel({ rows, onDeleteRow }) {
    const colClass = 'flex-1 flex items-center justify-center px-1 font-display text-sm text-[#1E1E1E]';

    return (
        <div className='flex flex-row'>
            <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md h-5 flex items-center justify-center'>4</div>
            <div className='flex flex-col items-center w-full gap-2 p-2'>
                <div className='bg-[#F3F3E4] rounded-xl w-[95%] mx-auto p-2'>
                    <div className='flex items-center font-display text-sm text-[#1E1E1E] pb-1 border-b border-[#C8D9A3]'>
                        <div className='w-8 text-center'>#</div>
                        <div className={colClass}>Code</div>
                        <div className={colClass}>Name</div>
                        <div className={colClass}>Start Time (s)</div>
                        <div className={colClass}>End Time (s)</div>
                        <div className={colClass}>Duration (s)</div>
                        <div className={colClass}>Start Freq (Hz)</div>
                        <div className={colClass}>End Freq (Hz)</div>
                        <div className={colClass}>Bandwidth (s)</div>
                        <div className='w-6'/>
                    </div>
                    <div className='flex flex-col'>
                        {rows.map((row, i) => (
                            <div key={row.id} className='flex items-center py-1 border-b border-[#C8D9A3] last:border-0'>
                                <div className='w-8 text-center font-display text-sm text-[#1E1E1E]'>{i + 1}</div>
                                <div className={colClass}>{row.code}</div>
                                <div className={colClass}>{row.name}</div>
                                <div className={colClass}>{row.startTime}</div>
                                <div className={colClass}>{row.endTime}</div>
                                <div className={colClass}>{row.duration}</div>
                                <div className={colClass}>{row.startFreq}</div>
                                <div className={colClass}>{row.endFreq}</div>
                                <div className={colClass}>{row.bandwidth}</div>
                                <div className='w-6 flex items-center justify-center'>
                                    <button 
                                        className='text-red-400 hover:text-red-600 font-display text-sm cursor-pointer'
                                        onClick={() => onDeleteRow(i)}>✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatasetPanel;
import { useState } from 'react';

function CodesPanel({ codesDict, setCodesDict }) {
    const [code, setCode] = useState('');
    const [speciesName, setSpeciesName] = useState('');
    const [search, setSearch] = useState('');

    const handleCreate = () => {
        if (!code.trim() || !speciesName.trim()) return;
        setCodesDict(prev => ({ ...prev, [code.trim()]: speciesName.trim() }));
        setCode('');
        setSpeciesName('');
    };

    const filteredCodes = Object.entries(codesDict).filter(([c, name]) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#1E1E1E] text-[#E6E5C9] text-sm font-display px-2 rounded-md w-5 flex items-center justify-center'>1</div>
            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Create Code
                <div className='flex flex-row items-center justify-center gap-1'>
                    <input
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder='Code'
                        onKeyDown={e => e.stopPropagation()}
                        maxLength={3}
                        className='w-15 px-2 py-1.5 text-sm bg-[#FFFFFF] rounded-md font-display placeholder-[#E6E5C9]'/>
                    <input
                        value={speciesName}
                        onChange={e => setSpeciesName(e.target.value)}
                        placeholder='Species Name'
                        onKeyDown={e => e.stopPropagation()}
                        maxLength={35}
                        className='w-25 px-2 py-1.5 text-sm bg-[#FFFFFF] rounded-md font-display placeholder-[#E6E5C9]'/>
                </div>
                <button
                    onClick={handleCreate}
                    className='w-full px-2 py-1.5 text-sm rounded-md font-display whitespace-nowrap cursor-pointer bg-[#FEECBE] hover:bg-[#FFDE9E]'>
                    Create
                </button>
            </div>

            <div className='bg-[#C8D9A3] flex flex-col flex-1 rounded-lg font-display text-md p-2 gap-1'>
                Codes
                <div className='flex flex-row gap-1'>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='Search...'
                        onKeyDown={e => e.stopPropagation()}
                        maxLength={35}
                        className='w-40 px-2 py-1.5 text-sm bg-[#FFFFFF] rounded-md font-display placeholder-[#E6E5C9]'/>
                </div>

                <div className='rounded-lg flex flex-col gap-1 max-h-48 overflow-y-auto'>
                    {filteredCodes.length === 0 ? (
                        <div className='font-display text-xs text-gray-400'>No codes found</div>
                    ) : (
                        filteredCodes.map(([c, name]) => (
                            <div key={c} className='bg-[#F3F3E4] rounded-md px-2 py-1'>
                                <div className='font-display text-sm'>{c}</div>
                                <div className='font-display text-xs'>{name}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default CodesPanel;
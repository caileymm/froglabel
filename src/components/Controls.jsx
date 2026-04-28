function Controls() {
    return (
        <div className="p-3 bg-[#82A062] flex rounded-xl items-center justify-center gap-3">
            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Pan Left
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                A
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Pan Right
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                D
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Pan Up
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                W
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Pan Down
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                D
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Zoom In (X)
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                Q
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Zoom Out (X)
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                E
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Zoom In (Y)
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                R
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Zoom Out (Y)
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                F
                </div>
            </button>

            <button className='bg-[#FEECBE] flex items-center justify-center font-display text-lg px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer gap-2 h-fit'>
                Reset View
                <div className='bg-[#1E1E1E] text-white font-display px-2 rounded-lg'>
                Esc
                </div>
            </button>
        </div>
    )
}

export default Controls
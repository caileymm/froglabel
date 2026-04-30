function SpectrogramControls() {
  return (
    <div className='p-2 bg-[#82A062] rounded-xl flex items-center justify-center gap-2'>
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-2'>
        <button className='px-2 py-1.5 text-sm bg-[#CAE4EF] rounded-md font-display whitespace-nowrap hover:bg-[#B4D2EF] cursor-pointer flex items-center gap-1'>
          Play Audio
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Space</div>
        </button>
      </div>
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Pan Left
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>A</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Pan Right
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>D</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Pan Up
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>W</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Pan Down
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>S</div>
        </button>
      </div>
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Zoom In (X)
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Q</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Zoom Out (X)
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>E</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Zoom In (Y)
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>R</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Zoom Out (Y)
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>F</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Reset View
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>C</div>
        </button>
      </div>
    </div>
  )
}
export default SpectrogramControls
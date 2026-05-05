function BoundingBoxControls() {
  return (
    <div className='p-2 bg-[#82A062] rounded-xl flex items-center justify-center gap-2'>
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <input placeholder='3-Char Code' className='w-25 px-2 py-1.5 text-sm bg-[#FFFFFF] rounded-md font-display placeholder-[#E6E5C9]'/>
        <input placeholder='Species Name' className='w-50 px-2 py-1.5 text-sm bg-[#FFFFFF] rounded-md font-display placeholder-[#E6E5C9]'/>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Start Labeling
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Enter</div>
        </button>
      </div>
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Select Box
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Tab</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#CAE4EF] rounded-md font-display whitespace-nowrap hover:bg-[#B4D2EF] cursor-pointer flex items-center gap-1'>
          Play Box Audio
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Shift</div>
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Space</div>
        </button>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Delete Box
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Delete</div>
        </button>
      </div>
      <div className='p-2 bg-[#C8D9A3] rounded-xl flex items-center gap-1'>
        <button className='px-2 py-1.5 text-sm bg-[#FEECBE] rounded-md font-display whitespace-nowrap hover:bg-[#FFDE9E] cursor-pointer flex items-center gap-1'>
          Deselect Box
          <div className='bg-[#1E1E1E] text-white text-sm font-display px-2 rounded-md'>Esc</div>
        </button>
      </div>
    </div>
  )
}
export default BoundingBoxControls
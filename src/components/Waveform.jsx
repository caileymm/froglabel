import play from '.././assets/play.png'

function Waveform() {
  return (
    <div className='p-3 bg-[#82A062] rounded-xl h-20 flex items-center gap-2'>
      <button className='bg-[#CAE4EF] rounded-xl w-15 h-12 flex items-center justify-center hover:bg-[#B4D2EF] cursor-pointer flex-shrink-0'>
        <img src={play} className='w-8 h-8' />
      </button>
      <div className='bg-white h-12 w-full rounded-lg'></div>
    </div>
  )
}

export default Waveform
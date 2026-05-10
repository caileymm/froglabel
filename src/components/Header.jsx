import frogIdLogo from '.././assets/frog_id_logo.png'

function Header() {
    return (
        <div className='w-full h-15 bg-[#1E1E1E] flex items-center justify-between p-5'>
            <div className='w-[100px] flex items-center'>
                <a href='https://www.frogid.net.au' target='_blank' rel='noreferrer'>
                    <img src={frogIdLogo} alt='frogid logo' className='w-[35px] h-[40px]' />
                </a>
            </div>
            <p className='font-display text-[#C8D9A3] text-center text-3xl'>FrogLabel Studio</p>
            <div className='w-[100px] flex justify-end'>
                <button className='bg-[#FEECBE] font-display px-3 py-2 rounded-lg hover:bg-[#FFDE9E] cursor-pointer'>
                    Export
                </button>
            </div>
        </div>
    )
}

export default Header
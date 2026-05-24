import frogIdLogo from '.././assets/frog_id_logo.png'
import frog from '.././assets/frog.png'

function Header({ frogTheme, setFrogTheme, theme, onSubmit }) {
    return (
        <div style={{ backgroundColor: theme.header }} className='w-full h-15 flex items-center justify-between p-2'>
            <div className='w-[100px] flex items-center'>
                <a href='https://www.frogid.net.au' target='_blank' rel='noreferrer'>
                    <img src={frogIdLogo} alt='frogid logo' className='w-[35px] h-[40px]' />
                </a>
            </div>
            <p style={{ color: theme.group }} className='font-display text-center text-3xl'>FrogLabel</p>
            <div className='flex flex-row items-center gap-2'>
                <div className='w-[100px] flex justify-end'>
                    <button onClick={() => setFrogTheme(prev => !prev)}>
                        <img
                            src={frog}
                            className='w-[40px] h-[40px] rounded-md bg-[#FFDE9E] cursor-pointer'
                        />
                    </button>
                </div>
                <div className='flex justify-end'>
                    <button 
                        onClick={onSubmit}
                        style={{ backgroundColor: theme.buttons, color: theme.buttonsText }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.buttonsHover)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.buttons)}
                        className='px-2 py-2 text-sm rounded-md font-display cursor-pointer text-left'>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
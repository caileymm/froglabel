import frogIdLogo from '.././assets/frog_id_logo.png'
import frog from '.././assets/frog.png'

function Header({ frogTheme, setFrogTheme, theme }) {
    return (
        <div style={{ backgroundColor: theme.keyButtons }} className='w-full h-15 flex items-center justify-between p-5'>
            <div className='w-[100px] flex items-center'>
                <a href='https://www.frogid.net.au' target='_blank' rel='noreferrer'>
                    <img src={frogIdLogo} alt='frogid logo' className='w-[35px] h-[40px]' />
                </a>
            </div>
            <p style={{ color: theme.group }} className='font-display text-center text-3xl'>FrogLabel</p>
            <div className='w-[100px] flex justify-end'>
                <button onClick={() => setFrogTheme(prev => !prev)}>
                    <img
                        src={frog}
                        className='w-[40px] h-[40px] rounded-md'
                        style={{ backgroundColor: frogTheme ? theme.panels : theme.buttons }}
                    />
                </button>
            </div>
        </div>
    )
}

export default Header
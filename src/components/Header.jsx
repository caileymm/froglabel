import frogIdLogo from '.././assets/frog_id_logo.png'

function Header() {
    return (
        <div className="w-full h-15 bg-[#1E1E1E] flex items-center justify-between px-4">
            <a href="https://www.frogid.net.au" target="_blank" rel="noreferrer">
                <img src={frogIdLogo} alt="frogid logo" className="w-[35px] h-[40px]" />
            </a>
            <p className="font-display text-[#C8D9A3] text-center text-2xl">FrogLabel Studio</p>
            <div className="w-[40px]" /> {/* empty spacer to keep title centered */}
        </div>
    )
}

export default Header
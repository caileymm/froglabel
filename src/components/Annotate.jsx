import Waveform from './Waveform'
import Spectrogram from './Spectrogram'
import Controls from './Controls'


function Annotate() {
    return (
        <div className='p-5 items-center'>
            <Waveform />
            <Spectrogram />
            <Controls />
        </div>
    )
}

export default Annotate
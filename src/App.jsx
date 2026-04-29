import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import Spectrogram, { useAudioEngine } from './components/Spectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'
import audioSrc from "../frogsounds.mp3";




function App() {
 const { audioRef, numFramesRef, waveformDataRef, ready } = useAudioEngine(audioSrc);


 return (
   <div>
     <Header />
     <div className='p-5 items-center'>
       {/* <BoundingBoxControls />
       <Spectrogram src={audioSrc}/> */}


       <audio ref={audioRef} src={audioSrc} />
       <BoundingBoxControls audioRef={audioRef} numFramesRef={numFramesRef} waveformDataRef={waveformDataRef} />
       <Spectrogram src={audioSrc} audioRef={audioRef} numFramesRef={numFramesRef} />




       <SpectrogramControls />
       <Dataset />
     </div>
   </div>
 )
}


export default App




import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import WaveformSpectrogram from './components/WaveformSpectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'



function App() {

 return (
   <div>
     <Header />
     <div className='px-5 py-2 flex-column items-center justify-center'>
       <BoundingBoxControls/>
       <WaveformSpectrogram/>
       <SpectrogramControls/>
       <Dataset />
     </div>
   </div>
 )
}


export default App




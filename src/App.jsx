import './App.css'
import Header from './components/Header'
import BoundingBoxControls from './components/BoundingBoxControls'
import Spectrogram from './components/Spectrogram'
import SpectrogramControls from './components/SpectrogramControls'
import Dataset from './components/Dataset'

function App() {

  return (
    <div>
      <Header />
      <div className='p-5 items-center'>
        <BoundingBoxControls />
        <Spectrogram />
        <SpectrogramControls />
        <Dataset />
      </div> 
    </div>
  )
}

export default App

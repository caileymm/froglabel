import './App.css'
import Header from './components/Header'
import Waveform from './components/Waveform'
import Spectrogram from './components/Spectrogram'
import Dataset from './components/Dataset'

function App() {

  return (
    <div>
      <Header />
      <Waveform />
      <Spectrogram />
      <Dataset />
      
    </div>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PanelProvider } from './components/PanelContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PanelProvider>
    <App />
    </PanelProvider>
  </StrictMode>,
)

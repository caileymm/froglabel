import { createContext, useContext, useState, useEffect, useRef } from 'react';

//all variables that need to be accessed by multiple files will be created and saved here to be accessed. 
const PanelContext = createContext(null);

export function PanelProvider({ children }) {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(null);
  const [showDataset, setShowDataset] = useState(false);
  const [brightness, setBrightness] = useState('1.0');
  const [contrast, setContrast] = useState('1.0');

  return (
    <PanelContext.Provider value={{
      showLeftPanel, setShowLeftPanel,
      rightPanel,    setRightPanel,
      showDataset,   setShowDataset,
      brightness,    setBrightness,
      contrast,      setContrast,
    }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanels() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('usePanels must be used inside <PanelProvider>');
  return ctx;
}
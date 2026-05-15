import { createContext, useContext, useState, useEffect, useRef } from 'react';

//all variables that need to be accessed by multiple files will be created and saved here to be accessed. 
const PanelContext = createContext(null);

export function PanelProvider({ children }) {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(null);
  const [showDataset, setShowDataset] = useState(false);
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleSpectroMouseDown = (e) => {
    if (rightPanel != 3) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
   };

  const handleSpectroMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setBrightness(prev => Math.max(0.0, Math.min(5.0, prev + dx * 0.01)));
    setContrast(prev =>   Math.max(0.0, Math.min(5.0, prev - dy * 0.01)));
  };

  const handleSpectroMouseUp = () => { isDragging.current = false; };
  


  return (
    <PanelContext.Provider value={{
      showLeftPanel, setShowLeftPanel,
      rightPanel,    setRightPanel,
      showDataset,   setShowDataset,
      brightness,    setBrightness,
      contrast,      setContrast,
      handleSpectroMouseDown,
      handleSpectroMouseMove,
      handleSpectroMouseUp,
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
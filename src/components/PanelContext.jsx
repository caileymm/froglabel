import { createContext, useContext, useState, useEffect, useRef } from 'react';

const PanelContext = createContext(null);

export function PanelProvider({ children }) {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(null);
  const [showDataset, setShowDataset] = useState(false);

  // Move keyboard shortcuts here so they work app-wide
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') setShowLeftPanel(prev => !prev);
      if (e.key === '2') setRightPanel(prev => prev === 2 ? null : 2);
      if (e.key === '3') setRightPanel(prev => prev === 3 ? null : 3);
      if (e.key === '4') setShowDataset(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PanelContext.Provider value={{
      showLeftPanel, setShowLeftPanel,
      rightPanel,    setRightPanel,
      showDataset,   setShowDataset,
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
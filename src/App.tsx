import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Landing from './Landing';
import Studio from './Studio';
import UygulamaApp from './uygulama/src/App';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div className="w-full min-h-screen grid bg-black" style={{ gridTemplateColumns: 'minmax(0, 1fr)', gridTemplateRows: 'minmax(0, auto)' }}>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<div style={{ gridArea: '1 / 1 / 2 / 2', zIndex: 20, position: 'relative', height: '100%' }}><Landing /></div>} />
          <Route path="/studio" element={<div style={{ gridArea: '1 / 1 / 2 / 2', zIndex: 10, position: 'relative', height: '100%' }}><Studio /></div>} />
          <Route path="/uygulama" element={<div className="uygulama-app" style={{ gridArea: '1 / 1 / 2 / 2', zIndex: 10, position: 'relative', height: '100%' }}><UygulamaApp /></div>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

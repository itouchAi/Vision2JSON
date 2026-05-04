import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Landing from './Landing';
import Studio from './Studio';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div className="w-full min-h-screen grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)', gridTemplateRows: 'minmax(0, auto)' }}>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<div style={{ gridArea: '1 / 1 / 2 / 2' }}><Landing /></div>} />
          <Route path="/studio" element={<div style={{ gridArea: '1 / 1 / 2 / 2' }}><Studio /></div>} />
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

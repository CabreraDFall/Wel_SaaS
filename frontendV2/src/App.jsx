

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './App.css'
import Login from './pages/Login/Login';
import LayoutOffline from './layouts/layoutOffline/LayoutOffline';
import Products from './pages/products/Products';
import LayoutOnline from './layouts/layoutOnline/LayoutOnline';
import Receptions from './pages/receptions/Receptions';
import PurcharseLabels from './pages/receptions/page/purcharseLabels/PurcharseLabels';
import NewLabel from './pages/labels/newLabel/NewLabel';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        // Rutas para usuarios autenticados
        <LayoutOnline>
          <Routes>
            <Route path="/recepciones" element={<Receptions />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/recepciones/:id" element={<PurcharseLabels />} />
            <Route path="/recepciones/:id/new" element={<NewLabel />} />

          </Routes>
        </LayoutOnline>
      ) : (
        // Layout offline para usuarios no autenticados
        <LayoutOffline>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </LayoutOffline>
      )}
    </BrowserRouter>
  );
}

export default App

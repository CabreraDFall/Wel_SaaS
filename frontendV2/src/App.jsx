

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './App.css'
import Login from './pages/Login/Login';
import LayoutOffline from './layouts/layoutOffline/LayoutOffline';
import Products from './pages/products/Products';
import LayoutOnline from './layouts/layoutOnline/LayoutOnline';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        // Rutas para usuarios autenticados
        <LayoutOnline>
          <Routes>
            <Route path="/" element={<Products />} />
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

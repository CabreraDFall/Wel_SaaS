import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './App.css'
import Login from './pages/Login/Login';
import LayoutOffline from './layouts/layoutOffline/LayoutOffline';
import Products from './pages/products/Products';
import LayoutOnline from './layouts/layoutOnline/LayoutOnline';
import Receptions from './pages/receptions/Receptions';
import PurcharseLabels from './pages/receptions/page/purcharseLabels/PurcharseLabels';
import NewLabel from './pages/labels/newLabel/NewLabel';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking authentication...');
      const token = localStorage.getItem('token');
      console.log('token:', token);
      if (token) {
        console.log('User is authenticated');
        setIsAuthenticated(true);
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  console.log('isAuthenticated:', isAuthenticated);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        // Rutas para usuarios autenticados
        <LayoutOnline>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Receptions /></ProtectedRoute>} />
            <Route path="/recepciones" element={<ProtectedRoute><Receptions /></ProtectedRoute>} />
            <Route path="/productos" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/recepciones/:id" element={<ProtectedRoute><PurcharseLabels /></ProtectedRoute>} />
            <Route path="/recepciones/:id/new" element={<ProtectedRoute><NewLabel /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LayoutOnline>
      ) : (
        // Layout offline para usuarios no autenticados
        <LayoutOffline>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LayoutOffline>
      )}
    </BrowserRouter>
  );
}

export default App

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
import Print from './pages/labels/print/Print';
import { useParams } from 'react-router-dom';
import AddProductPanel from './pages/products/components/add/AddProductPanel';

function PrintWrapper() {
  const { id } = useParams();
  return <Print purchase_order={id} />;
}

function NewLabelWrapper() {
  const { id } = useParams();
  return <NewLabel purchase_order={id} />;
}

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
            <Route path="/" element={<ProtectedRoute><Receptions setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
            <Route path="/recepciones" element={<ProtectedRoute><Receptions setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
            <Route path="/productos" element={<ProtectedRoute><Products setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
            <Route path="/recepciones/:id" element={<ProtectedRoute><PurcharseLabels setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
            <Route path="/recepciones/:id/new" element={<ProtectedRoute><NewLabelWrapper setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
            <Route path="/labels/print/:id" element={<ProtectedRoute><PrintWrapper setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
            <Route path="/products/new" element={<ProtectedRoute><AddProductPanel /></ProtectedRoute>} />
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

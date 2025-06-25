import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react'; // Importa useContext, useState, useEffect

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
import { UserContext, UserProvider } from './utils/userProvider/UserProvider'; // Importa UserContext y UserProvider
import NewReception from './pages/receptions/newReception/NewReception'; // Importa el nuevo componente NewReception

function PrintWrapper() {
  const { id } = useParams();
  return <Print purchase_order={id} />;
}

function NewLabelWrapper() {
  const { id } = useParams();
  return <NewLabel purchase_order={id} />;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext); // Usa el contexto del usuario

  if (loading) {
    return <div>Cargando...</div>; // Muestra un indicador de carga mientras se carga el usuario
  }

  if (!user) {
    return <Navigate to="/" />; // Redirige si no hay usuario autenticado
  }
  return children;
}

function App() {
  // Restaura la lógica de autenticación basada en localStorage y isAuthenticated para la renderización condicional inicial
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
    return <div>Loading...</div>; // Indicador de carga inicial mientras se verifica el token
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? ( // Usa isAuthenticated para decidir si renderizar la parte privada o pública
        // Rutas para usuarios autenticados
        <UserProvider> {/* Envuelve la parte privada con UserProvider */}
          <LayoutOnline>
            <Routes>
              {/* Elimina setIsAuthenticated de las rutas protegidas */}
              <Route path="/" element={<ProtectedRoute><Receptions /></ProtectedRoute>} />
              <Route path="/recepciones" element={<ProtectedRoute><Receptions /></ProtectedRoute>} />
              <Route path="/productos" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/recepciones/new" element={<ProtectedRoute><NewReception /></ProtectedRoute>} /> {/* Agrega la nueva ruta para crear una recepción */}
              <Route path="/recepciones/:id" element={<ProtectedRoute><PurcharseLabels /></ProtectedRoute>} />
              <Route path="/recepciones/:id/new" element={<ProtectedRoute><NewLabelWrapper /></ProtectedRoute>} />
              <Route path="/labels/print/:id" element={<ProtectedRoute><PrintWrapper /></ProtectedRoute>} />
              <Route path="/products/new" element={<ProtectedRoute><AddProductPanel /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </LayoutOnline>
        </UserProvider>
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

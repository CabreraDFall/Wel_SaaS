import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/print.css';
import Login from './pages/login/Login';
import Products from './pages/products/Products';
import Reception from './pages/reception/Reception';
import Labels from './pages/labels/Labels';
import Users from './pages/users/Users';
import Dashboard from './pages/dashboard/dashboard';
import Settings from './pages/settings/settings';
import { useEffect, useState } from 'react';
import NewReception from './pages/reception/newReception/NewReception';
import NewLabel from './pages/labels/newLabel/NewLabel';
import Nav from './components/Nav';
import { UserProvider } from './UserProvider';
import PrintReception from './pages/reception/PrintReception';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    localStorage.setItem('token', token || '');
  }, [token]);

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <UserProvider>
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception"
          element={
            <ProtectedRoute>
              <Reception />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/:purchase_order"
          element={
            <ProtectedRoute>
              <NewReception />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/new-reception"
          element={
            <ProtectedRoute>
              <NewReception />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/:purchase_order/print"
          element={
            <ProtectedRoute>
              <PrintReception />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labels"
          element={
            <ProtectedRoute>
              <Labels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labels/new-label"
          element={
            <ProtectedRoute>
              <NewLabel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labels/:purchase_order"
          element={
            <ProtectedRoute>
              <NewLabel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;

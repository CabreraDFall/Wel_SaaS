import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import Products from './pages/products/Products';
import Reception from './pages/reception/Reception';
import Labels from './pages/labels/Labels';
import Users from './pages/users/Users';
import Dashboard from './pages/dashboard/dashboard';
import NewReception from './pages/reception/newReception/NewReception';
import NewLabel from './pages/labels/newLabel/NewLabel';
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Get the value from local storage if it exists
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn === 'true'; // Convert string to boolean
  });

  useEffect(() => {
    // Update local storage when isLoggedIn changes
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
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
      </Routes>
    </>
  );
}

export default App;

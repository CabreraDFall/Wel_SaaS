import React, { createContext, useState, useEffect } from 'react';
import { userService } from './services/api/userService'; // Importa el servicio de usuario

// Crea el contexto del usuario
export const UserContext = createContext();

// Crea el proveedor del usuario
export const UserProvider = ({ children }) => {
  // Define el estado del usuario
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Agrega un estado de carga

  // Efecto para cargar la información del usuario al inicio
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Llama al servicio de usuario para obtener la información del usuario actual
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
       
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        // Maneja el error apropiadamente, por ejemplo, redirigiendo al usuario a la página de inicio de sesión
      } finally {
        setLoading(false); // Establece el estado de carga en falso, independientemente del resultado
      }
    };

    loadUser();
  }, []);

  // Función para actualizar la información del usuario
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  // Valor del contexto que se proporcionará a los componentes hijos
  const contextValue = {
    user,
    updateUser,
    loading, // Proporciona el estado de carga
  };

  // Proporciona el contexto a los componentes hijos
  return (
    <UserContext.Provider value={contextValue}>
      {/* Muestra un indicador de carga si el usuario aún se está cargando */}
      {loading ? <p>Cargando información del usuario...</p> : children}
    </UserContext.Provider>
  );
};

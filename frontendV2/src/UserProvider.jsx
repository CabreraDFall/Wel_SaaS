import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto del usuario
export const UserContext = createContext();

// Crea el proveedor del usuario
export const UserProvider = ({ children }) => {
    // Define el estado del usuario
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Agrega un estado de carga

    // Efecto para cargar la información del usuario al inicio
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    console.log('No hay token de autenticación.');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    // Si la respuesta no es OK (ej. 401 Unauthorized), limpia el token y redirige
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        // Considerar redirigir al login aquí si es necesario en App.jsx o en la ruta protegida
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const userData = await response.json();
                setUser(userData);
                console.log('Datos del usuario cargados:', userData);

            } catch (error) {
                console.error('Error al cargar el usuario:', error);
                setUser(null);
                console.log('Error al cargar el usuario. Usuario establecido a null.');
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
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
            {/* Puedes agregar un indicador de carga o renderizar los hijos directamente */}
            {loading ? <p>Cargando información del usuario...</p> : children}
        </UserContext.Provider>
    );
};

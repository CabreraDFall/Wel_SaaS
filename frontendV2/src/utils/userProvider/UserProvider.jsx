import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto del usuario
export const UserContext = createContext();

// Crea el proveedor del usuario
export const UserProvider = ({ children }) => {
    // Estado del usuario
    const [user, setUser] = useState(false);
    // Estado de carga
    const [loading, setLoading] = useState(true);

    // Carga la información del usuario al inicio
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                // Obtiene el token del localStorage
                const token = localStorage.getItem('token');
                // Si no hay token, establece el usuario como null y retorna
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    console.log('No hay token de autenticación.');
                    return;
                }

                // Realiza la petición al backend para obtener la información del usuario
                const response = await fetch('http://localhost:3000/api/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Si la respuesta no es exitosa, maneja el error
                if (!response.ok) {
                    // Si el error es 401 o 403, elimina el token y redirige al login
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        // Considerar redirigir al login aquí si es necesario en App.jsx o en la ruta protegida
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parsea la respuesta a JSON
                let userData = await response.json();

                // Decodifica el token para obtener el ID del usuario
                if (token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace('-', '+').replace('_', '/');
                        const decodedToken = JSON.parse(atob(base64));
                        const userId = decodedToken.id; // Asume que el ID del usuario está en el token
                        // Filtra los datos del usuario para obtener solo el usuario actual
                        userData = Array.isArray(userData) ? userData.filter(user => user.id === userId)[0] || null : userData;
                    } catch (error) {
                        console.error('Error al decodificar el token:', error);
                        // Si hay un error al decodificar el token, establece el usuario como null
                        userData = null;
                    }
                }

                // Establece la información del usuario en el estado
                setUser(userData);
                console.log('Datos del usuario cargados (después de setUser):', userData);

            } catch (error) {
                // Maneja cualquier error que ocurra durante la petición
                console.error('Error al cargar el usuario:', error);
                setUser(null);
                console.log('Error al cargar el usuario. Usuario establecido a null.');
            } finally {
                // Establece el estado de carga a false
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
        loading,
    };

    // Proporciona el contexto a los componentes hijos
    console.log("UserProvider - user:", user); // Agregado console.log
    return (
        <UserContext.Provider value={contextValue}>
            {loading ? <p>Cargando información del usuario...</p> : children}
        </UserContext.Provider>
    );
};

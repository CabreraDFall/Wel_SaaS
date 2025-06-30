import React, { useState } from 'react';
import Btn from '../../components/button/Btn';
import "./login.css";

function Login() {
  // Estado para el usuario y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', { // Reemplaza con la URL de tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Inicio de sesión exitoso
        console.log('Inicio de sesión exitoso:', responseData);
        localStorage.setItem("token", responseData.accessToken);
        localStorage.setItem("userId", responseData.userId); // Store userId
        // Redirigir al usuario a la página principal
        window.location.href = "/";
      } else {
        // Error en el inicio de sesión
        console.error('Error en el inicio de sesión:', responseData);
        // Mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error de red:', error);
      // Mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className='login'>
      <h5>Iniciar sesion</h5>
      <div className='form__group'>
        {/* Input para el usuario */}
        <input
          className='form__input'
          type="email"
          placeholder={""}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="usuario" className='form__label'>Usuario</label>
        {/* Input para la contraseña */}
      </div>
      <div className='form__group'>
        <input
          className='form__input'
          type="password"
          id='pass'
          placeholder={" "}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="pass" className='form__label'>Contraseña</label>
      </div>
      <div>
        {/* Botón para iniciar sesión */}
        <Btn text={"Iniciar"} onClick={handleLogin} />
      </div>
    </div>
  );
}

export default Login;

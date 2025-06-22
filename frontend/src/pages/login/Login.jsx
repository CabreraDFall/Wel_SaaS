import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./login.css";
import Nav from "../../components/Nav";
const Login = ({ setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
        // Aquí se puede redirigir al usuario a la página principal
      } else {
        console.error("Login failed:", response.status);
        // Aquí se puede mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error("Login error:", error);
      // Aquí se puede mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Dark blue section with background effect */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col relative overflow-hidden login-container">
        {/* Background blur effects */}
        <div className="blur-background">
          {/* Circle 1 */}
          <div className="blur-circle-1" />
          {/* Circle 2 */}
          <div className="blur-circle-2" />
          {/* Circle 3 */}
          <div className="blur-circle-3" />
          {/* Circle 4 */}
          <div className="blur-circle-4" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-white">
          {/* Replace with your actual logo */}
          <Nav />
        </div>
        <div className="relative z-10 flex flex-col justify-center flex-grow text-white text-center gap-6">
          <h2 className="text-3xl font-bold mb-4">
            Compromiso, Innovación<br />
            y Excelencia en Cada Paso
          </h2>
          <p className="text-gray-300">
            Creemos en hacer las cosas bien desde el inicio,<br />
            aportando soluciones creativas que generan impacto real.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">

        <div className="flex-1 paddingLeft">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#14154F] paddingBottom">Iniciar sesion</h1>
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AbrahamC"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >

                  </button>
                </div>
              </div>


              <button
                type="submit"
                className="w-full bg-[#4763E4] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar
              </button>

              <div className="text-center">
                <a href="#" className="text-[#4763E4] text-sm hover:underline">
                  Recuperar tu contraseña
                </a>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

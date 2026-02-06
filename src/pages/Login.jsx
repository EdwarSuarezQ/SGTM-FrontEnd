import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("El correo electrónico es requerido");
      return false;
    }
    if (!formData.password) {
      setError("La contraseña es requerida");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("El formato del correo electrónico no es válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await login({ email: formData.email, password: formData.password });
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9f5ff] p-4">
      <div className="bg-white w-full max-w-md px-6 py-10 sm:px-10 sm:py-12 rounded-2xl shadow-lg shadow-blue-100 border border-gray-200">
        {/* Icono */}
        <div className="flex justify-center mb-4">
          <i className="fas fa-ship text-blue-600 text-3xl sm:text-4xl"></i>
        </div>

        {/* Títulos */}
        <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Sistema de Gestión Portuaria - Buenaventura
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm bg-red-100 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              />

              {/* Botón ojo */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Iniciar Sesión
          </button>

          {/* Enlace */}
          {/* Enlace de registro eliminado - Solo admin crea usuarios */}
        </form>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfileRequest, changePasswordRequest } from "../api/auth";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, Save } from "lucide-react";

function Profile() {
  const { user, setUser } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const res = await updateProfileRequest(profileData);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Perfil actualizado correctamente");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar el perfil"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoadingPassword(true);

    try {
      const res = await changePasswordRequest({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error(
        error.response?.data?.message || "Error al cambiar la contraseña"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-2">Mi Perfil</h1>
      <p className="text-gray-600 mb-6">
        Administra tu información personal y seguridad
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Perfil */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Información Personal
              </h2>
              <p className="text-sm text-gray-500">
                Actualiza tu nombre y correo electrónico
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={profileData.nombre}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingProfile}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium ${
                  loadingProfile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Save className="w-5 h-5 mr-2" />
                {loadingProfile ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>

          {/* Información de Rol */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Rol:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user?.rol === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user?.rol === "admin" ? "Administrador" : "Empleado"}
              </span>
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Seguridad
              </h2>
              <p className="text-sm text-gray-500">
                Cambia tu contraseña regularmente
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingPassword}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium ${
                  loadingPassword
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Lock className="w-5 h-5 mr-2" />
                {loadingPassword ? "Actualizando..." : "Cambiar Contraseña"}
              </button>
            </div>
          </form>

          {/* Consejos de Seguridad */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Consejos de Seguridad
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Usa al menos 8 caracteres</li>
              <li>• Combina letras, números y símbolos</li>
              <li>• No uses información personal</li>
              <li>• Cambia tu contraseña regularmente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

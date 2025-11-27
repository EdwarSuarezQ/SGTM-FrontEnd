import { createContext, useContext, useState, useEffect } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  logoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get() || {};

      // Intentar verificar sesión siempre (puede haber cookie HttpOnly o cookie visible)
      try {
        // verifyTokenRequest manejará si envía header o confía en cookie
        const res = await verifyTokenRequest();
        
        if (res.data && res.data.user) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginRequest(credentials);
      
      // Guardar token en cookie (12h) con path '/'
      if (res.data && res.data.token) {
        Cookies.set("token", res.data.token, { expires: 0.5, path: '/' });
      }

      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch (error) {
      throw error.response?.data?.message || "Error al iniciar sesión";
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerRequest(userData);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al registrar usuario";
    }
  };

  const logout = () => {
    logoutRequest();
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

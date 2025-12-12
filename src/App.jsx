import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tareas from "./pages/Tareas";
import Embarques from "./pages/Embarques";
import Personal from "./pages/Personal";
import Rutas from "./pages/Rutas";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Facturas from "./pages/Facturas";
import Embarcaciones from "./pages/Embarcaciones";
import Almacenes from "./pages/Almacenes";
import Estadisticas from "./pages/Estadisticas";
import ExportarDatos from "./pages/ExportarDatos";
import Profile from "./pages/Profile";
import MiEspacio from "./pages/MiEspacio";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inicio" element={<Navigate to="/" replace />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="embarques" element={<Embarques />} />
          <Route path="personal" element={<Personal />} />
          <Route path="rutas" element={<Rutas />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="embarcaciones" element={<Embarcaciones />} />
          <Route path="almacen" element={<Almacenes />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="exportar-datos" element={<ExportarDatos />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="mi-espacio" element={<MiEspacio />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;

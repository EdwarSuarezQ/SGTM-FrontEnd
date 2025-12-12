import Loader from "../common/Loader";
import {
  getColorEstadoRuta,
  getEstadoTextRuta,
  getTipoTextRuta,
  getColorTipoRuta,
} from "../../utils/helpers";

const RutasTable = ({ loading, rutasFiltradas, handleEdit, handleDelete, user }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Ruta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origen - Destino
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distancia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duración
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            {user && user.rol === "admin" && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={user && user.rol === "admin" ? "8" : "7"} className="px-6 py-8 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <Loader size="md" color="text-blue-500" />
                  <span className="ml-2">Cargando rutas...</span>
                </div>
              </td>
            </tr>
          ) : rutasFiltradas.length > 0 ? (
            rutasFiltradas.map((ruta) => (
              <tr key={ruta._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ruta.idRuta}
                  </div>
                  <div className="text-sm text-gray-500">{ruta.nombre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ruta.nombre}
                  </div>
                </td>
                {/* Origen - Destino - VERSIÓN COMPACTA Y CENTRADA */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-start space-x-2">
                    <div className="text-sm text-gray-900">
                      <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate" title={ruta.origen}>
                        {ruta.origen}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {ruta.paisOrigen}
                      </div>
                    </div>
                    <i className="fas fa-long-arrow-alt-right text-gray-400 mx-1"></i>
                    <div className="text-sm text-gray-900">
                      <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate" title={ruta.destino}>
                        {ruta.destino}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {ruta.paisDestino}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ruta.distancia}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ruta.duracion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorTipoRuta(
                      ruta.tipo
                    )}`}
                  >
                    <i
                      className={`fas ${
                        ruta.tipo === "internacional"
                          ? "fa-globe-americas"
                          : ruta.tipo === "regional"
                          ? "fa-map"
                          : "fa-water"
                      } mr-1`}
                    ></i>
                    {getTipoTextRuta(ruta.tipo)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoRuta(
                      ruta.estado
                    )}`}
                  >
                    {getEstadoTextRuta(ruta.estado)}
                  </span>
                </td>
                {user && user.rol === "admin" && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(ruta)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(ruta._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user && user.rol === "admin" ? "8" : "7"} className="px-6 py-8 text-center text-gray-500">
                No se encontraron rutas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RutasTable;

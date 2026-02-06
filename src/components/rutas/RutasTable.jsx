import Loader from "../common/Loader";
import {
  getColorEstadoRuta,
  getEstadoTextRuta,
  getTipoTextRuta,
  getColorTipoRuta,
} from "../../utils/helpers";

const RutasTable = ({ loading, rutasFiltradas, handleEdit, handleDelete, user }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Vista de Tabla para Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Ruta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen - Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distancia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              {user && user.rol === "admin" && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ruta.idRuta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ruta.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{ruta.origen}</span>
                      <i className="fas fa-arrow-right mx-2 text-gray-300"></i>
                      <span className="font-medium">{ruta.destino}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ruta.distancia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ruta.duracion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorTipoRuta(ruta.tipo)}`}>
                      {getTipoTextRuta(ruta.tipo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoRuta(ruta.estado)}`}>
                      {getEstadoTextRuta(ruta.estado)}
                    </span>
                  </td>
                  {user && user.rol === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(ruta)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(ruta._id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "8" : "7"} className="px-6 py-8 text-center text-gray-500">No hay rutas encontradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móvil */}
      <div className="lg:hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader size="md" color="text-blue-500" />
            <p className="mt-2 text-gray-500">Cargando rutas...</p>
          </div>
        ) : rutasFiltradas.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {rutasFiltradas.map((ruta) => (
              <div key={ruta._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{ruta.nombre}</h3>
                    <p className="text-xs text-gray-500">ID: {ruta.idRuta}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getColorEstadoRuta(ruta.estado)}`}>
                    {getEstadoTextRuta(ruta.estado)}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="flex-1">
                      <p className="text-gray-400 text-[9px] uppercase font-bold">Origen</p>
                      <p className="font-semibold">{ruta.origen}</p>
                      {ruta.paisOrigen && <p className="text-[10px] text-gray-500">{ruta.paisOrigen}</p>}
                    </div>
                    <div className="px-3">
                      <i className="fas fa-long-arrow-alt-right text-blue-400"></i>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-gray-400 text-[9px] uppercase font-bold">Destino</p>
                      <p className="font-semibold">{ruta.destino}</p>
                      {ruta.paisDestino && <p className="text-[10px] text-gray-500">{ruta.paisDestino}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-blue-50/50 p-2 rounded">
                    <p className="text-[9px] text-blue-400 uppercase font-bold">Distancia</p>
                    <p className="text-xs font-bold text-blue-700">{ruta.distancia}</p>
                  </div>
                  <div className="bg-purple-50/50 p-2 rounded">
                    <p className="text-[9px] text-purple-400 uppercase font-bold">Duración</p>
                    <p className="text-xs font-bold text-purple-700">{ruta.duracion}</p>
                  </div>
                  <div className={`p-2 rounded ${ruta.tipo === 'internacional' ? 'bg-orange-50/50' : 'bg-green-50/50'}`}>
                    <p className={`text-[9px] uppercase font-bold ${ruta.tipo === 'internacional' ? 'text-orange-400' : 'text-green-400'}`}>Tipo</p>
                    <p className={`text-xs font-bold ${ruta.tipo === 'internacional' ? 'text-orange-700' : 'text-green-700'}`}>{getTipoTextRuta(ruta.tipo)}</p>
                  </div>
                </div>

                {user && user.rol === "admin" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(ruta)} className="flex-1 py-1.5 bg-zinc-100 text-zinc-700 rounded text-xs font-semibold">
                      <i className="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(ruta._id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold">
                      <i className="fas fa-trash mr-1"></i> Borrar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">No hay rutas disponibles</div>
        )}
      </div>
    </div>
  );
};

export default RutasTable;

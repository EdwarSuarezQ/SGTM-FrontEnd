import Loader from "../common/Loader";
import {
  getColorOcupacion,
  getColorEstadoAlmacen,
  getTextoEstadoAlmacen,
  calcularDiasRestantes,
} from "../../utils/helpers";

const AlmacenesTable = ({
  loading,
  almacenesFiltrados,
  handleEdit,
  handleDelete,
  user,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Vista de Tabla para Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almacén</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad / Ocupación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próximo Mantenimiento</th>
              {user && user.rol === "admin" && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "6" : "5"} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <Loader size="md" color="text-blue-500" />
                    <span className="ml-2">Cargando almacenes...</span>
                  </div>
                </td>
              </tr>
            ) : almacenesFiltrados.length > 0 ? (
              almacenesFiltrados.map((almacen) => (
                <tr key={almacen._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{almacen.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{almacen.ubicacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{almacen.capacidad?.toLocaleString()} unidades</div>
                    <div className="flex items-center mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className={`h-2 rounded-full ${getColorOcupacion(almacen.ocupacion)}`} style={{ width: `${almacen.ocupacion}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{almacen.ocupacion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoAlmacen(almacen.estado)}`}>
                      {getTextoEstadoAlmacen(almacen.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {almacen.proximoMantenimiento ? (
                      <>
                        <div className="text-sm text-gray-900">{new Date(almacen.proximoMantenimiento).toLocaleDateString("es-ES", { timeZone: "UTC" })}</div>
                        <div className="text-xs text-gray-500">{calcularDiasRestantes(almacen.proximoMantenimiento)}</div>
                      </>
                    ) : <span className="text-sm text-gray-500">No programado</span>}
                  </td>
                  {user && user.rol === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(almacen)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(almacen._id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "6" : "5"} className="px-6 py-8 text-center text-gray-500">No se encontraron almacenes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móvil */}
      <div className="md:hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader size="md" color="text-blue-500" />
            <p className="mt-2 text-gray-500">Cargando almacenes...</p>
          </div>
        ) : almacenesFiltrados.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {almacenesFiltrados.map((almacen) => (
              <div key={almacen._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{almacen.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{almacen.ubicacion}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getColorEstadoAlmacen(almacen.estado)}`}>
                    {getTextoEstadoAlmacen(almacen.estado).toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500">OCUPACIÓN</span>
                    <span className="text-[10px] font-bold text-gray-700">{almacen.ocupacion}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${getColorOcupacion(almacen.ocupacion)} transition-all duration-500`} style={{ width: `${almacen.ocupacion}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 uppercase font-semibold">Capacidad</span>
                    <span className="text-xs font-bold text-gray-800">{almacen.capacidad?.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 uppercase font-semibold">Mantenimiento</span>
                    <span className="text-xs font-bold text-gray-800 italic">
                      {almacen.proximoMantenimiento ? new Date(almacen.proximoMantenimiento).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                {user && user.rol === "admin" && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => handleEdit(almacen)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold hover:bg-blue-100 transition-colors">
                      <i className="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(almacen._id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold hover:bg-red-100 transition-colors">
                      <i className="fas fa-trash mr-1"></i> Borrar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm italic">No hay almacenes disponibles</div>
        )}
      </div>
    </div>
  );
};

export default AlmacenesTable;

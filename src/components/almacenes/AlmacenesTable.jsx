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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Almacén
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacidad / Ocupación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Próximo Mantenimiento
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <Loader size="md" color="text-blue-500" />
                  <span className="ml-2">Cargando almacenes...</span>
                </div>
              </td>
            </tr>
          ) : almacenesFiltrados.length > 0 ? (
            almacenesFiltrados.map((almacen) => (
              <tr key={almacen._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={almacen.nombre}>
                    {almacen.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-[200px] truncate" title={almacen.ubicacion}>
                    {almacen.ubicacion}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">
                      {almacen.capacidad?.toLocaleString()} unidades
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getColorOcupacion(
                            almacen.ocupacion
                          )}`}
                          style={{ width: `${almacen.ocupacion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {almacen.ocupacion}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoAlmacen(
                      almacen.estado
                    )}`}
                  >
                    {getTextoEstadoAlmacen(almacen.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {almacen.proximoMantenimiento ? (
                    <>
                      <div className="text-sm text-gray-900">{new Date(almacen.proximoMantenimiento).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</div>
                      <div className="text-xs text-gray-500">{calcularDiasRestantes(almacen.proximoMantenimiento)}</div>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No programado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user && user.rol === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(almacen)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(almacen._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No se encontraron almacenes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlmacenesTable;

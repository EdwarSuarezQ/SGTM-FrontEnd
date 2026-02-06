import Loader from "../common/Loader";
import { getIniciales, getColorIniciales } from "../../utils/helpers";
import {
  getEstadoTextPersonal,
  getColorEstadoPersonal,
} from "../../utils/helpers";

const PersonalTable = ({
  loading,
  personalFiltrado,
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              {user && user.rol === "admin" && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "5" : "4"} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <Loader size="md" color="text-blue-500" />
                    <span className="ml-2">Cargando personal...</span>
                  </div>
                </td>
              </tr>
            ) : personalFiltrado.length > 0 ? (
              personalFiltrado.map((persona) => (
                <tr key={persona._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full ${getColorIniciales(persona.nombre)} flex items-center justify-center text-white font-semibold`}>
                        {getIniciales(persona.nombre)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{persona.nombre}</div>
                        <div className="text-sm text-gray-500 max-w-[200px] truncate">{persona.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{persona.puesto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{persona.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoPersonal(persona.estado)}`}>
                      {getEstadoTextPersonal(persona.estado)}
                    </span>
                  </td>
                  {user && user.rol === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(persona)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(persona._id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "5" : "4"} className="px-6 py-8 text-center text-gray-500">No hay empleados encontrados</td>
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
            <p className="mt-2 text-gray-500">Cargando personal...</p>
          </div>
        ) : personalFiltrado.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {personalFiltrado.map((persona) => (
              <div key={persona._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-3">
                  <div className={`h-12 w-12 rounded-full ${getColorIniciales(persona.nombre)} flex items-center justify-center text-white font-bold text-lg`}>
                    {getIniciales(persona.nombre)}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{persona.nombre}</h3>
                    <p className="text-xs text-gray-500 truncate">{persona.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getColorEstadoPersonal(persona.estado)}`}>
                    {getEstadoTextPersonal(persona.estado).toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-400 block mb-1 uppercase text-[8px] font-bold tracking-wider">Puesto</span>
                    <span className="text-gray-700 font-medium truncate italic">{persona.puesto}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-400 block mb-1 uppercase text-[8px] font-bold tracking-wider">Depto.</span>
                    <span className="text-gray-700 font-medium truncate italic">{persona.departamento}</span>
                  </div>
                </div>

                {user && user.rol === "admin" && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                    <button onClick={() => handleEdit(persona)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold flex items-center justify-center">
                      <i className="fas fa-edit mr-2"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(persona._id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold flex items-center justify-center">
                      <i className="fas fa-trash mr-2"></i> Borrar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm italic">No hay empleados encontrados</div>
        )}
      </div>
    </div>
  );
};

export default PersonalTable;

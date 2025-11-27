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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Puesto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Departamento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
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
                    <div
                      className={`h-10 w-10 rounded-full ${getColorIniciales(
                        persona.nombre
                      )} flex items-center justify-center text-white font-semibold`}
                    >
                      {getIniciales(persona.nombre)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={persona.nombre}>
                        {persona.nombre}
                      </div>
                      <div className="text-sm text-gray-500 max-w-[200px] truncate" title={persona.email}>
                        {persona.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{persona.puesto}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {persona.departamento}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoPersonal(
                      persona.estado
                    )}`}
                  >
                    {getEstadoTextPersonal(persona.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user && user.rol === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(persona)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(persona._id)}
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
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                No se encontraron empleados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PersonalTable;

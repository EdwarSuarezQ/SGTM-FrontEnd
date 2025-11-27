import Loader from '../common/Loader';
import { getIniciales, getColorIniciales, calcularDiasRestantes, getEstadoText } from '../../utils/helpers';

const TareasTable = ({ loading, tareasFiltradas, handleEdit, handleDelete, user }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado a</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha límite</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <Loader size="md" color="text-blue-500" />
                  <span className="ml-2">Cargando tareas...</span>
                </div>
              </td>
            </tr>
          ) : tareasFiltradas.length > 0 ? (
            tareasFiltradas.map((tarea) => (
              <tr key={tarea._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-[250px] truncate" title={tarea.titulo}>{tarea.titulo}</div>
                  <div className="text-sm text-gray-500 max-w-[250px] truncate" title={tarea.descripcion}>{tarea.descripcion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full ${getColorIniciales(tarea.asignado)} flex items-center justify-center text-white font-medium text-sm`}>
                      {getIniciales(tarea.asignado)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate" title={tarea.asignado}>{tarea.asignado || 'No asignado'}</div>
                      <div className="text-sm text-gray-500">{tarea.departamento || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(tarea.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</div>
                  <div className="text-xs text-gray-500">{calcularDiasRestantes(tarea.fecha)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tarea.departamento || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tarea.prioridad === 'alta'
                      ? 'bg-red-100 text-red-800'
                      : tarea.prioridad === 'media'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    <i className={`fas ${
                      tarea.prioridad === 'alta' 
                        ? 'fa-exclamation-triangle' 
                        : tarea.prioridad === 'media'
                        ? 'fa-exclamation-circle'
                        : 'fa-info-circle'
                    } mr-1`}></i>
                    {tarea.prioridad === 'alta' ? 'Alta' : tarea.prioridad === 'media' ? 'Media' : 'Baja'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    tarea.estado === 'completada' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : tarea.estado === 'en-progreso'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {getEstadoText(tarea.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    onClick={() => handleEdit(tarea)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {user && user.rol === "admin" && (
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(tarea._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No hay tareas que coincidan con los filtros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TareasTable;

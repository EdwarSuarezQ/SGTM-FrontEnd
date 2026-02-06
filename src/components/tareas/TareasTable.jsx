import Loader from '../common/Loader';
import { getIniciales, getColorIniciales, calcularDiasRestantes, getEstadoText } from '../../utils/helpers';

const TareasTable = ({ loading, tareasFiltradas, handleEdit, handleDelete, user }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Vista de Tabla para Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado a</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha límite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
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
                    <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={tarea.titulo}>{tarea.titulo}</div>
                    <div className="text-xs text-gray-500 max-w-[200px] truncate" title={tarea.descripcion}>{tarea.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full ${getColorIniciales(tarea.asignado)} flex items-center justify-center text-white font-medium text-xs`}>
                        {getIniciales(tarea.asignado)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">{tarea.asignado || 'No asignado'}</div>
                        <div className="text-xs text-gray-500">{tarea.departamento || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(tarea.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</div>
                    <div className="text-xs text-gray-500">{calcularDiasRestantes(tarea.fecha)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' : tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {tarea.prioridad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      tarea.estado === 'completada' ? 'bg-green-100 text-green-800 border-green-200' : tarea.estado === 'en-progreso' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {getEstadoText(tarea.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-3" onClick={() => handleEdit(tarea)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    {user && user.rol === "admin" && (
                      <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(tarea._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay tareas disponibles</td>
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
            <p className="mt-2 text-gray-500">Cargando tareas...</p>
          </div>
        ) : tareasFiltradas.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {tareasFiltradas.map((tarea) => (
              <div key={tarea._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{tarea.titulo}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tarea.descripcion}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' : tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {tarea.prioridad}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full ${getColorIniciales(tarea.asignado)} flex items-center justify-center text-white text-xs font-bold`}>
                      {getIniciales(tarea.asignado)}
                    </div>
                    <div className="ml-2">
                      <p className="text-xs font-medium text-gray-900">{tarea.asignado || 'Sin asignar'}</p>
                      <p className="text-[10px] text-gray-500">{tarea.departamento || 'No dept.'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-gray-900">{new Date(tarea.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                    <p className="text-[9px] text-gray-500">{calcularDiasRestantes(tarea.fecha)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${
                    tarea.estado === 'completada' ? 'bg-green-50 text-green-700 border-green-100' : tarea.estado === 'en-progreso' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                  }`}>
                    {getEstadoText(tarea.estado)}
                  </span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 p-2" onClick={() => handleEdit(tarea)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    {user && user.rol === "admin" && (
                      <button className="text-red-500 p-2" onClick={() => handleDelete(tarea._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">No hay tareas que coincidan</div>
        )}
      </div>
    </div>
  );
};

export default TareasTable;

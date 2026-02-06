import Loader from "../common/Loader";
import {
  formatDate,
  getColorEstado,
  getTextoEstado,
  getBadgeInfo,
} from "../../utils/helpers";

// Componente interno para el badge de tipo
const BadgeTipo = ({ tipo, imo }) => {
  const info = getBadgeInfo(tipo);

  return (
    <div className="flex flex-col items-start">
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${info.color}`}
      >
        <i className={`${info.icono} mr-1`}></i> {info.nombre}
      </span>
      <div className="text-xs text-gray-500 mt-1">IMO: {imo || "N/A"}</div>
    </div>
  );
};

const EmbarcacionesTable = ({
  loading,
  embarcacionesFiltradas,
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Embarcación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMO / Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
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
                    <span className="ml-2">Cargando embarcaciones...</span>
                  </div>
                </td>
              </tr>
            ) : embarcacionesFiltradas.length > 0 ? (
              embarcacionesFiltradas.map((embarcacion) => (
                <tr key={embarcacion._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{embarcacion.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><BadgeTipo tipo={embarcacion.tipo} imo={embarcacion.imo} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(embarcacion.fecha)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{embarcacion.capacidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstado(embarcacion.estado)}`}>
                      {getTextoEstado(embarcacion.estado)}
                    </span>
                  </td>
                  {user && user.rol === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(embarcacion)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(embarcacion._id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "6" : "5"} className="px-6 py-8 text-center text-gray-500">No hay embarcaciones encontradas</td>
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
            <p className="mt-2 text-gray-500">Cargando embarcaciones...</p>
          </div>
        ) : embarcacionesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-4">
            {embarcacionesFiltradas.map((embarcacion) => (
              <div key={embarcacion._id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-gray-900">{embarcacion.nombre}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getColorEstado(embarcacion.estado)}`}>
                    {getTextoEstado(embarcacion.estado)}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <BadgeTipo tipo={embarcacion.tipo} imo={embarcacion.imo} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <p className="text-gray-400 uppercase text-[9px] font-bold">ETA</p>
                    <p className="text-gray-700 font-medium">{formatDate(embarcacion.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase text-[9px] font-bold text-right">Capacidad</p>
                    <p className="text-gray-700 font-medium text-right">{embarcacion.capacidad}</p>
                  </div>
                </div>
                {user && user.rol === "admin" && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => handleEdit(embarcacion)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                      <i className="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(embarcacion._id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold">
                      <i className="fas fa-trash mr-1"></i> Borrar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm italic">No hay embarcaciones disponibles</div>
        )}
      </div>
    </div>
  );
};

export default EmbarcacionesTable;

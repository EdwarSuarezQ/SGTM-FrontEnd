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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Embarcación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IMO / Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ETA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacidad
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
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
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
                  <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={embarcacion.nombre}>
                    {embarcacion.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BadgeTipo tipo={embarcacion.tipo} imo={embarcacion.imo} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(embarcacion.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {embarcacion.capacidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstado(
                      embarcacion.estado
                    )}`}
                  >
                    {getTextoEstado(embarcacion.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user && user.rol === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(embarcacion)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(embarcacion._id)}
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
                No se encontraron embarcaciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmbarcacionesTable;

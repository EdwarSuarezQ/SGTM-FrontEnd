import Loader from "../common/Loader";
import {
  formatDate,
  getColorEstadoEmbarque,
  getTextoEstadoEmbarque,
  getBadgeTipoCarga,
  calcularDiasRestantes,
} from "../../utils/helpers";

// Componente interno para el badge de tipo de carga
const BadgeTipoCarga = ({ tipoCarga }) => {
  const info = getBadgeTipoCarga(tipoCarga);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${info.badge}`}
    >
      <i className={`fas ${info.icono} mr-1`}></i>
      {info.texto}
    </span>
  );
};

const EmbarquesTable = ({
  loading,
  embarquesFiltrados,
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
              N° Guía
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origen / Destino
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Salida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carga
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
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <Loader size="md" color="text-blue-500" />
                  <span className="ml-2">Cargando embarques...</span>
                </div>
              </td>
            </tr>
          ) : embarquesFiltrados.length > 0 ? (
            embarquesFiltrados.map((embarque) => (
              <tr key={embarque._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {embarque.numeroGuia}
                  </div>
                  <div className="text-sm text-gray-500">
                    Peso: {embarque.peso || 0} kg
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-[150px] truncate" title={embarque.cliente}>
                    {embarque.cliente}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-[250px] truncate" title={`${embarque.origen} -> ${embarque.destino}`}>
                    {embarque.origen}
                    <i className="fas fa-long-arrow-alt-right text-gray-400 mx-1"></i>
                    {embarque.destino}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(embarque.fechaSalida)}</div>
                  <div className="text-xs text-gray-500">{calcularDiasRestantes(embarque.fechaSalida)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BadgeTipoCarga tipoCarga={embarque.tipoCarga} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoEmbarque(
                      embarque.estado
                    )}`}
                  >
                    {getTextoEstadoEmbarque(embarque.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user && user.rol === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(embarque)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(embarque._id)}
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
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No se encontraron embarques
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmbarquesTable;

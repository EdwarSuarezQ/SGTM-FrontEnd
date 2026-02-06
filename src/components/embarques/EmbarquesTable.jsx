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
    <div className="bg-white rounded-lg shadow-sm">
      {/* Vista de Tabla para Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Guía</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen / Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              {user && user.rol === "admin" && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "7" : "6"} className="px-6 py-8 text-center text-gray-500">
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
                    <div className="text-sm font-medium text-gray-900">{embarque.numeroGuia}</div>
                    <div className="text-xs text-gray-500">Peso: {embarque.peso || 0} kg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{embarque.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {embarque.origen} <i className="fas fa-long-arrow-alt-right text-gray-400 mx-1"></i> {embarque.destino}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(embarque.fechaSalida)}</div>
                    <div className="text-xs text-gray-500">{calcularDiasRestantes(embarque.fechaSalida)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><BadgeTipoCarga tipoCarga={embarque.tipoCarga} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoEmbarque(embarque.estado)}`}>
                      {getTextoEstadoEmbarque(embarque.estado)}
                    </span>
                  </td>
                  {user && user.rol === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(embarque)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(embarque._id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "7" : "6"} className="px-6 py-8 text-center text-gray-500">No hay embarques encontrados</td>
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
            <p className="mt-2 text-gray-500">Cargando embarques...</p>
          </div>
        ) : embarquesFiltrados.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {embarquesFiltrados.map((embarque) => (
              <div key={embarque._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Guía: {embarque.numeroGuia}</h3>
                    <p className="text-xs text-blue-600 font-medium">{embarque.cliente}</p>
                  </div>
                  <BadgeTipoCarga tipoCarga={embarque.tipoCarga} />
                </div>

                <div className="flex items-center text-xs text-gray-700 mb-3 bg-gray-50 p-2 rounded">
                  <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                  <span className="font-medium">{embarque.origen}</span>
                  <i className="fas fa-arrow-right mx-2 text-gray-300"></i>
                  <span className="font-medium">{embarque.destino}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-gray-400 uppercase font-bold text-[9px]">Salida</span>
                    <span className="text-gray-900">{formatDate(embarque.fechaSalida)}</span>
                    <span className="text-gray-500 italic">{calcularDiasRestantes(embarque.fechaSalida)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-400 uppercase font-bold text-[9px]">Estado</span>
                    <span className={`font-bold ${getTextoEstadoEmbarque(embarque.estado) === 'Completado' ? 'text-green-600' : 'text-blue-600'}`}>
                      {getTextoEstadoEmbarque(embarque.estado)}
                    </span>
                  </div>
                </div>

                {user && user.rol === "admin" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(embarque)} className="flex-1 py-1.5 bg-zinc-100 text-zinc-700 rounded text-xs font-semibold">
                      <i className="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(embarque._id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold">
                      <i className="fas fa-trash mr-1"></i> Borrar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">No hay embarques disponibles</div>
        )}
      </div>
    </div>
  );
};

export default EmbarquesTable;

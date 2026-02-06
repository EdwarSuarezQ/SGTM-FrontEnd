import Loader from "../common/Loader";
import {
  formatCurrency,
  getColorEstadoFactura,
  getEstadoTextFactura,
  calcularDiasRestantes,
} from "../../utils/helpers";

const FacturasTable = ({
  loading,
  facturasFiltradas,
  handleEdit,
  handleDelete,
  filtros,
  user,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Vista de Tabla para Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Factura</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Emisión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
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
                    <span className="ml-2">Cargando facturas...</span>
                  </div>
                </td>
              </tr>
            ) : facturasFiltradas.length > 0 ? (
              facturasFiltradas.map((factura) => (
                <tr key={factura._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{factura.idFactura}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{factura.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(factura.fechaEmision).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</div>
                    <div className="text-xs text-gray-500">{calcularDiasRestantes(factura.fechaEmision)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{formatCurrency(factura.monto)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoFactura(factura.estado)}`}>
                      {getEstadoTextFactura(factura.estado)}
                    </span>
                  </td>
                  {user && user.rol === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(factura)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(factura._id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && user.rol === "admin" ? "6" : "5"} className="px-6 py-8 text-center text-gray-500">No hay facturas registradas</td>
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
            <p className="mt-2 text-gray-500">Cargando facturas...</p>
          </div>
        ) : facturasFiltradas.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {facturasFiltradas.map((factura) => (
              <div key={factura._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Factura: {factura.idFactura}</h3>
                    <p className="text-xs text-blue-600 font-medium">{factura.cliente}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getColorEstadoFactura(factura.estado)}`}>
                    {getEstadoTextFactura(factura.estado)}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs">
                    <p className="text-gray-400 uppercase text-[9px] font-bold">Fecha Emisión</p>
                    <p className="text-gray-700">{new Date(factura.fechaEmision).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                    <p className="text-[10px] text-gray-500 italic">{calcularDiasRestantes(factura.fechaEmision)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 uppercase text-[9px] font-bold">Total</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(factura.monto)}</p>
                  </div>
                </div>

                {user && user.rol === "admin" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(factura)} className="flex-1 py-1.5 bg-zinc-100 text-zinc-700 rounded text-xs font-semibold">
                      <i className="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(factura._id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold">
                      <i className="fas fa-trash mr-1"></i> Borrar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <i className="fas fa-file-invoice text-4xl mb-3 opacity-20"></i>
            <p className="text-sm">No se encontraron facturas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturasTable;

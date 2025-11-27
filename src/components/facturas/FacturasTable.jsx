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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Factura
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Emisión
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
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
                  <span className="ml-2">Cargando facturas...</span>
                </div>
              </td>
            </tr>
          ) : facturasFiltradas.length > 0 ? (
            facturasFiltradas.map((factura) => (
              <tr key={factura._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {factura.idFactura}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-[200px] truncate" title={factura.cliente}>{factura.cliente}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(factura.fechaEmision).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</div>
                  <div className="text-xs text-gray-500">{calcularDiasRestantes(factura.fechaEmision)}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(factura.monto)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoFactura(
                      factura.estado
                    )}`}
                  >
                    {getEstadoTextFactura(factura.estado)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user && user.rol === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(factura)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(factura._id)}
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
                <div className="flex flex-col items-center justify-center">
                  <i className="fas fa-file-invoice text-4xl text-gray-300 mb-2"></i>
                  <p className="text-lg font-medium">
                    No se encontraron facturas
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {Object.values(filtros).some((filtro) => filtro !== "")
                      ? "Intenta ajustar los filtros de búsqueda"
                      : 'Crea tu primera factura haciendo clic en "Nueva Factura"'}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FacturasTable;

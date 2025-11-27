import React from "react";

const EmbarquesForm = ({
  modalIsOpen,
  setModalIsOpen,
  currentEmbarque,
  handleSubmit,
  formData,
  handleInputChange,
  handleRutaChange,
  embarcaciones,
  rutas,
  almacenes,
}) => {
  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg">
          <h3 className="text-base font-semibold">
            {currentEmbarque ? "Editar Embarque" : "Nuevo Embarque"}
          </h3>
          <button
            className="text-white hover:text-gray-200 text-xl"
            onClick={() => setModalIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Guía *
              </label>
              <input
                type="text"
                name="numeroGuia"
                value={formData.numeroGuia}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Embarcación *
              </label>
              <select
                name="embarcacionId"
                value={formData.embarcacionId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccionar embarcación...</option>
                {embarcaciones.map((emb) => (
                  <option key={emb._id} value={emb._id}>
                    {emb.nombre} - {emb.imo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ruta *
              </label>
              <select
                name="rutaId"
                value={formData.rutaId}
                onChange={handleRutaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccionar ruta...</option>
                {rutas.map((ruta) => (
                  <option key={ruta._id} value={ruta._id}>
                    {ruta.nombre} ({ruta.origen} → {ruta.destino})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Almacén (Opcional)
              </label>
              <select
                name="almacenId"
                value={formData.almacenId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Sin almacén asignado</option>
                {almacenes.map((almacen) => (
                  <option key={almacen._id} value={almacen._id}>
                    {almacen.nombre} - {almacen.ubicacion}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origen *
                </label>
                <input
                  type="text"
                  name="origen"
                  value={formData.origen}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Auto-llenado desde ruta"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destino *
                </label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Auto-llenado desde ruta"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Salida *
                </label>
                <input
                  type="date"
                  name="fechaSalida"
                  value={formData.fechaSalida ? new Date(formData.fechaSalida).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Estimada Entrega
                </label>
                <input
                  type="date"
                  name="fechaEstimada"
                  value={formData.fechaEstimada ? new Date(formData.fechaEstimada).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Carga *
                </label>
                <select
                  name="tipoCarga"
                  value={formData.tipoCarga}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="seco">Seco</option>
                  <option value="refrigerado">Refrigerado</option>
                  <option value="peligroso">Peligroso</option>
                  <option value="perecedero">Perecedero</option>
                  <option value="sobredimensionado">Sobredimensionado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en-transito">En tránsito</option>
                  <option value="en-aduana">En aduana</option>
                  <option value="entregado">Entregado</option>
                  <option value="completado">Completado</option>
                  <option value="retrasado">Retrasado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volumen (m³)
                </label>
                <input
                  type="number"
                  name="volumen"
                  value={formData.volumen}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Declarado
                </label>
                <input
                  type="number"
                  name="valorDeclarado"
                  value={formData.valorDeclarado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 rounded-b-lg text-sm">
          <button
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setModalIsOpen(false)}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
            onClick={handleSubmit}
          >
            <i className="fas fa-save mr-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbarquesForm;

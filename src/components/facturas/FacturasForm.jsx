import React, { useState, useEffect } from "react";
import { getFieldClassName, ErrorMessage } from "../../utils/formValidation.jsx";

const FacturasForm = ({
  modalIsOpen,
  setModalIsOpen,
  currentFactura,
  handleSubmit,
  formData,
  handleInputChange,
  handleEmbarqueChange,
  opcionesEstados,
  embarques,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!modalIsOpen) {
      setErrors({});
      setTouched({});
    }
  }, [modalIsOpen, currentFactura]);

  const validateField = (name, value) => {
    switch (name) {
      case 'idFactura':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el ID de la factura';
        }
        return null;
      case 'cliente':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el nombre del cliente';
        }
        return null;
      case 'fechaEmision':
        if (!value) {
          return 'Por favor, seleccione la fecha de emisión';
        }
        return null;
      case 'monto':
        if (!value || value === '' || Number(value) < 0) {
          return 'Por favor, ingrese un monto válido';
        }
        return null;
      case 'estado':
        if (!value) {
          return 'Por favor, seleccione el estado de la factura';
        }
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChangeWithValidation = (e) => {
    handleInputChange(e);
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const fieldsToValidate = ['idFactura', 'cliente', 'fechaEmision', 'monto', 'estado'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    const allTouched = {};
    fieldsToValidate.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleSubmit(e);
  };

  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg">
          <h3 className="text-base font-semibold">
            {currentFactura ? "Editar Factura" : "Nueva Factura"}
          </h3>
          <button
            className="text-white hover:text-gray-200 text-xl"
            onClick={() => setModalIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm overflow-y-auto flex-1">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Factura *
              </label>
              <input
                type="text"
                name="idFactura"
                value={formData.idFactura}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('idFactura', errors, touched, 'w-full px-3 py-2 border rounded-md uppercase')}
                placeholder="Ej: FAC-001"
              />
              <ErrorMessage error={errors.idFactura} touched={touched.idFactura} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Embarque (Opcional)
              </label>
              <select
                name="embarqueId"
                value={formData.embarqueId}
                onChange={handleEmbarqueChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Sin embarque asociado</option>
                {embarques.map((embarque) => (
                  <option key={embarque._id} value={embarque._id}>
                    {embarque.numeroGuia} - {embarque.cliente}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Al seleccionar un embarque, el cliente se auto-llena
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('cliente', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                placeholder="Nombre del cliente"
              />
              <ErrorMessage error={errors.cliente} touched={touched.cliente} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Emisión *
                </label>
                <input
                  type="date"
                  name="fechaEmision"
                  value={formData.fechaEmision ? new Date(formData.fechaEmision).toISOString().split('T')[0] : ''}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('fechaEmision', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                />
                <ErrorMessage error={errors.fechaEmision} touched={touched.fechaEmision} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto *
                </label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('monto', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <ErrorMessage error={errors.monto} touched={touched.monto} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('estado', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              >
                <option value="">Seleccionar estado...</option>
                {opcionesEstados.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors.estado} touched={touched.estado} />
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
            onClick={handleFormSubmit}
          >
            <i className="fas fa-save mr-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturasForm;

import React, { useState, useEffect } from "react";
import { getFieldClassName, ErrorMessage } from "../../utils/formValidation.jsx";

const EmbarcacionesForm = ({
  modalIsOpen,
  setModalIsOpen,
  currentEmbarcacion,
  handleSubmit,
  formData,
  handleInputChange,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset validation when modal closes or opens with new data
  useEffect(() => {
    if (!modalIsOpen) {
      setErrors({});
      setTouched({});
    }
  }, [modalIsOpen, currentEmbarcacion]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el nombre de la embarcación';
        }
        if (value.length < 3) {
          return 'El nombre debe contener al menos 3 caracteres';
        }
        return null;
      
      case 'imo':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el número IMO';
        }
        if (value.length < 7) {
          return 'El número IMO debe contener al menos 7 caracteres';
        }
        return null;
      
      case 'fecha':
        if (!value) {
          return 'Por favor, seleccione la fecha de arribo (ETA)';
        }
        return null;
      
      case 'capacidad':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese la capacidad de la embarcación';
        }
        return null;
      
      case 'tipo':
        if (!value) {
          return 'Por favor, seleccione el tipo de embarcación';
        }
        return null;
      
      case 'estado':
        if (!value) {
          return 'Por favor, seleccione el estado de la embarcación';
        }
        return null;
      
      default:
        return null;
    }
  };

  // Handle blur event
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Enhanced input change handler
  const handleInputChangeWithValidation = (e) => {
    handleInputChange(e);
    const { name, value } = e.target;
    
    // Clear error if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Validate form before submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const newErrors = {};
    const fieldsToValidate = ['nombre', 'imo', 'fecha', 'capacidad', 'tipo', 'estado'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Mark all fields as touched
    const allTouched = {};
    fieldsToValidate.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call original submit handler
    handleSubmit(e);
  };

  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg">
          <h3 className="text-base font-semibold">
            {currentEmbarcacion ? "Editar Embarcación" : "Nueva Embarcación"}
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
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('nombre', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              />
              <ErrorMessage error={errors.nombre} touched={touched.nombre} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número IMO *
              </label>
              <input
                type="text"
                name="imo"
                value={formData.imo}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('imo', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              />
              <ErrorMessage error={errors.imo} touched={touched.imo} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Arribo (ETA) *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ''}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('fecha', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              />
              <ErrorMessage error={errors.fecha} touched={touched.fecha} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad *
              </label>
              <input
                type="text"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('capacidad', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                placeholder="Ej. 5000 TEU"
              />
              <ErrorMessage error={errors.capacidad} touched={touched.capacidad} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('tipo', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="contenedor">Portacontenedores</option>
                  <option value="granel">Granelero</option>
                  <option value="general">Carga general</option>
                  <option value="cisterna">Tanquero</option>
                </select>
                <ErrorMessage error={errors.tipo} touched={touched.tipo} />
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
                  <option value="pendiente">Pendiente</option>
                  <option value="en-transito">En tránsito</option>
                  <option value="en-ruta">En ruta</option>
                  <option value="en-puerto">En puerto</option>
                </select>
                <ErrorMessage error={errors.estado} touched={touched.estado} />
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 rounded-b-lg">
          <button
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            onClick={() => setModalIsOpen(false)}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center"
            onClick={handleFormSubmit}
          >
            <i className="fas fa-save mr-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbarcacionesForm;

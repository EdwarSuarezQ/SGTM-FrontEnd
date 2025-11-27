import React, { useState, useEffect } from 'react';
import { getFieldClassName, ErrorMessage } from '../../utils/formValidation.jsx';

const TareasForm = ({ 
  modalIsOpen, 
  setModalIsOpen, 
  currentTarea, 
  handleSubmit, 
  formData, 
  handleInputChange, 
  handleAsignadoChange, 
 
  personal,
  user
}) => {
  const isAdmin = user && user.rol === "admin";
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset validation when modal closes or opens with new data
  useEffect(() => {
    if (!modalIsOpen) {
      setErrors({});
      setTouched({});
    }
  }, [modalIsOpen, currentTarea]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'titulo':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese un título para la tarea';
        }
        if (value.length < 3) {
          return 'El título debe contener al menos 3 caracteres';
        }
        return null;
      
      case 'fecha':
        if (!value) {
          return 'Por favor, seleccione una fecha límite';
        }
        return null;
      
      case 'prioridad':
        if (!value) {
          return 'Por favor, seleccione la prioridad de la tarea';
        }
        return null;
      
      case 'estado':
        if (!value) {
          return 'Por favor, seleccione el estado de la tarea';
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
    const fieldsToValidate = ['titulo', 'fecha', 'prioridad', 'estado'];
    
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
            {currentTarea ? 'Editar Tarea' : 'Nueva Tarea'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('titulo', errors, touched, 'w-full px-3 py-2 border rounded-md disabled:bg-gray-100')}
                disabled={!isAdmin}
              />
              <ErrorMessage error={errors.titulo} touched={touched.titulo} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChangeWithValidation}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                rows="3"
                disabled={!isAdmin}
              ></textarea>
            </div>
            
            {/* Select para asignar persona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
              <select
                value={personal.find(p => p.nombre === formData.asignado)?._id || ''}
                onChange={handleAsignadoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                disabled={!isAdmin}
              >
                <option value="">Seleccionar persona...</option>
                {personal.map(persona => (
                  <option key={persona._id} value={persona._id}>
                    {persona.nombre} - {persona.puesto} ({persona.departamento})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ''}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('fecha', errors, touched, 'w-full px-3 py-2 border rounded-md disabled:bg-gray-100')}
                disabled={!isAdmin}
              />
              <ErrorMessage error={errors.fecha} touched={touched.fecha} />
              <div className="text-xs text-gray-500 mt-1">Haz clic para seleccionar una fecha</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('prioridad', errors, touched, 'w-full px-3 py-2 border rounded-md disabled:bg-gray-100')}
                  disabled={!isAdmin}
                >
                  <option value="">Seleccionar prioridad...</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
                <ErrorMessage error={errors.prioridad} touched={touched.prioridad} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('estado', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                >
                  <option value="">Seleccionar estado...</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en-progreso">En Progreso</option>
                  <option value="completada">Completada</option>
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

export default TareasForm;

import React, { useState, useEffect } from "react";
import { getFieldClassName, ErrorMessage } from "../../utils/formValidation.jsx";

const PersonalForm = ({
  modalIsOpen,
  setModalIsOpen,
  currentPersonal,
  handleSubmit,
  formData,
  handleInputChange,
  opcionesPuestos,
  opcionesDepartamentos,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset validation when modal closes or opens with new data
  useEffect(() => {
    if (!modalIsOpen) {
      setErrors({});
      setTouched({});
    }
  }, [modalIsOpen, currentPersonal]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el nombre completo del empleado';
        }
        if (value.length < 3) {
          return 'El nombre debe contener al menos 3 caracteres';
        }
        return null;
      
      case 'email':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el correo electrónico';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)';
        }
        return null;
      
      case 'tipoDocumento':
        if (!value || value === '') {
          return 'Por favor, seleccione el tipo de documento';
        }
        return null;
      
      case 'numeroDocumento':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el número de documento';
        }
        if (value.length < 5) {
          return 'El número de documento debe contener al menos 5 caracteres';
        }
        return null;
      
      case 'puesto':
        if (!value || value === '') {
          return 'Por favor, seleccione el puesto del empleado';
        }
        return null;
      
      case 'departamento':
        if (!value || value === '') {
          return 'Por favor, seleccione el departamento';
        }
        return null;
      
      case 'estado':
        if (!value) {
          return 'Por favor, seleccione el estado del empleado';
        }
        return null;
      
      case 'rol':
        if (!value) {
          return 'Por favor, seleccione el rol del sistema';
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
    const fieldsToValidate = ['nombre', 'email', 'tipoDocumento', 'numeroDocumento', 'puesto', 'departamento', 'estado', 'rol'];
    
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
            {currentPersonal ? "Editar Empleado" : "Nuevo Empleado"}
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
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('email', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              />
              <ErrorMessage error={errors.email} touched={touched.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('tipoDocumento', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              >
                <option value="">Seleccionar tipo...</option>
                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                <option value="Cédula de Extranjería">Cédula de Extranjería</option>
              </select>
              <ErrorMessage error={errors.tipoDocumento} touched={touched.tipoDocumento} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('numeroDocumento', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              />
              <ErrorMessage error={errors.numeroDocumento} touched={touched.numeroDocumento} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puesto *
              </label>
              <select
                name="puesto"
                value={formData.puesto}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('puesto', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              >
                <option value="">Seleccionar puesto...</option>
                {opcionesPuestos.map((puesto) => (
                  <option key={puesto} value={puesto}>
                    {puesto}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors.puesto} touched={touched.puesto} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('departamento', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              >
                <option value="">Seleccionar departamento...</option>
                {opcionesDepartamentos.map((depto) => (
                  <option key={depto} value={depto}>
                    {depto}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors.departamento} touched={touched.departamento} />
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
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <ErrorMessage error={errors.estado} touched={touched.estado} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol de Sistema *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChangeWithValidation}
                onBlur={handleBlur}
                className={getFieldClassName('rol', errors, touched, 'w-full px-3 py-2 border rounded-md')}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <ErrorMessage error={errors.rol} touched={touched.rol} />
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

export default PersonalForm;

import React, { useState, useEffect } from "react";
import { getFieldClassName, ErrorMessage } from "../../utils/formValidation.jsx";
import Select from "react-select";
import { Country } from "country-state-city";

const AlmacenesForm = ({
  modalIsOpen,
  setModalIsOpen,
  currentAlmacen,
  handleSubmit,
  formData,
  handleInputChange,
  formatDateForInput,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name, // Guardamos el nombre del país
      isoCode: country.isoCode
    }));
    setPaises(countries);
  }, []);

  useEffect(() => {
    if (!modalIsOpen) {
      setErrors({});
      setTouched({});
    }
  }, [modalIsOpen, currentAlmacen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el nombre del almacén';
        }
        return null;
      case 'ubicacion':
        if (!value) {
          return 'Por favor, seleccione la ubicación (país)';
        }
        return null;
      case 'capacidad':
        if (!value || value === '' || Number(value) < 1) {
          return 'Por favor, ingrese una capacidad válida (mínimo 1)';
        }
        return null;
      case 'estado':
        if (!value) {
          return 'Por favor, seleccione el estado del almacén';
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

  const handleSelectBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
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

  const handleUbicacionChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    // Simular evento para handleInputChange
    handleInputChange({
      target: {
        name: "ubicacion",
        value: value
      }
    });
    
    if (touched.ubicacion) {
      const error = validateField("ubicacion", value);
      setErrors(prev => ({ ...prev, ubicacion: error }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const fieldsToValidate = ['nombre', 'ubicacion', 'capacidad', 'estado'];
    
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

  // Estilos personalizados para react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: errors.ubicacion && touched.ubicacion ? '#ef4444' : provided.borderColor,
      '&:hover': {
        borderColor: errors.ubicacion && touched.ubicacion ? '#ef4444' : provided.borderColor
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg">
          <h3 className="text-base font-semibold">
            {currentAlmacen ? "Editar Almacén" : "Nuevo Almacén"}
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
                Ubicación (País) *
              </label>
              <Select
                options={paises}
                value={paises.find(p => p.value === formData.ubicacion) || null}
                onChange={handleUbicacionChange}
                onBlur={() => handleSelectBlur('ubicacion')}
                placeholder="Seleccionar país..."
                styles={customStyles}
                className="text-sm"
                noOptionsMessage={() => "No se encontraron países"}
              />
              <ErrorMessage error={errors.ubicacion} touched={touched.ubicacion} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad *
                </label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('capacidad', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                  min="1"
                />
                <ErrorMessage error={errors.capacidad} touched={touched.capacidad} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ocupación (%)
                </label>
                <input
                  type="number"
                  name="ocupacion"
                  value={formData.ocupacion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  <option value="operativo">Operativo</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="inoperativo">Inoperativo</option>
                </select>
                <ErrorMessage error={errors.estado} touched={touched.estado} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próximo Mantenimiento
                </label>
                <input
                  type="date"
                  name="proximoMantenimiento"
                  value={formData.proximoMantenimiento ? new Date(formData.proximoMantenimiento).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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

export default AlmacenesForm;

import React, { useState, useEffect } from "react";
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import { getFieldClassName, ErrorMessage } from "../../utils/formValidation.jsx";

const RutasForm = ({
  modalIsOpen,
  setModalIsOpen,
  currentRuta,
  handleSubmit,
  formData,
  handleInputChange,
  opcionesTipos,
  opcionesEstados,
}) => {
  const [estadosOrigen, setEstadosOrigen] = useState([]);
  const [ciudadesOrigen, setCiudadesOrigen] = useState([]);
  const [estadosDestino, setEstadosDestino] = useState([]);
  const [ciudadesDestino, setCiudadesDestino] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const paises = Country.getAllCountries();

  // Reset validation when modal closes
  useEffect(() => {
    if (!modalIsOpen) {
      setErrors({});
      setTouched({});
    }
  }, [modalIsOpen, currentRuta]);

  // Inicializar estados y ciudades cuando se carga una ruta para editar o cuando cambian los países
  useEffect(() => {
    if (formData.paisOrigen) {
      const states = State.getStatesOfCountry(formData.paisOrigen);
      setEstadosOrigen(states);
      
      if (formData.estadoOrigen) {
        const cities = City.getCitiesOfState(formData.paisOrigen, formData.estadoOrigen);
        setCiudadesOrigen(cities);
      }
    } else {
      setEstadosOrigen([]);
      setCiudadesOrigen([]);
    }
  }, [formData.paisOrigen, formData.estadoOrigen]);

  useEffect(() => {
    if (formData.paisDestino) {
      const states = State.getStatesOfCountry(formData.paisDestino);
      setEstadosDestino(states);
      
      if (formData.estadoDestino) {
        const cities = City.getCitiesOfState(formData.paisDestino, formData.estadoDestino);
        setCiudadesDestino(cities);
      }
    } else {
      setEstadosDestino([]);
      setCiudadesDestino([]);
    }
  }, [formData.paisDestino, formData.estadoDestino]);

  const validateField = (name, value) => {
    switch (name) {
      case 'idRuta':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el ID de la ruta';
        }
        return null;
      case 'nombre':
        if (!value || value.trim() === '') {
          return 'Por favor, ingrese el nombre de la ruta';
        }
        return null;
      case 'paisOrigen':
        if (!value) {
          return 'Por favor, seleccione el país de origen';
        }
        return null;
      case 'estadoOrigen':
        if (!value) {
          return 'Por favor, seleccione el estado/departamento de origen';
        }
        return null;
      case 'origen':
        if (!value) {
          return 'Por favor, seleccione la ciudad de origen';
        }
        return null;
      case 'paisDestino':
        if (!value) {
          return 'Por favor, seleccione el país de destino';
        }
        return null;
      case 'estadoDestino':
        if (!value) {
          return 'Por favor, seleccione el estado/departamento de destino';
        }
        return null;
      case 'destino':
        if (!value) {
          return 'Por favor, seleccione la ciudad de destino';
        }
        return null;
      case 'tipo':
        if (!value) {
          return 'Por favor, seleccione el tipo de ruta';
        }
        return null;
      case 'estado':
        if (!value) {
          return 'Por favor, seleccione el estado de la ruta';
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

  const handlePaisOrigenChange = (e) => {
    const paisCode = e.target.value;
    handleInputChange(e);
    
    // Cargar estados del país seleccionado
    const states = State.getStatesOfCountry(paisCode);
    setEstadosOrigen(states);
    
    // Limpiar estado y ciudad si cambió el país
    handleInputChange({ target: { name: "estadoOrigen", value: "" } });
    handleInputChange({ target: { name: "origen", value: "" } });
    setCiudadesOrigen([]);
    
    // Validate
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleEstadoOrigenChange = (e) => {
    const estadoCode = e.target.value;
    handleInputChange(e);
    
    // Cargar ciudades del estado seleccionado
    const cities = City.getCitiesOfState(formData.paisOrigen, estadoCode);
    setCiudadesOrigen(cities);
    
    // Limpiar ciudad si cambió el estado
    handleInputChange({ target: { name: "origen", value: "" } });
    
    // Validate
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handlePaisDestinoChange = (e) => {
    const paisCode = e.target.value;
    handleInputChange(e);
    
    // Cargar estados del país seleccionado
    const states = State.getStatesOfCountry(paisCode);
    setEstadosDestino(states);
    
    // Limpiar estado y ciudad si cambió el país
    handleInputChange({ target: { name: "estadoDestino", value: "" } });
    handleInputChange({ target: { name: "destino", value: "" } });
    setCiudadesDestino([]);
    
    // Validate
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleEstadoDestinoChange = (e) => {
    const estadoCode = e.target.value;
    handleInputChange(e);
    
    // Cargar ciudades del estado seleccionado
    const cities = City.getCitiesOfState(formData.paisDestino, estadoCode);
    setCiudadesDestino(cities);
    
    // Limpiar ciudad si cambió el estado
    handleInputChange({ target: { name: "destino", value: "" } });
    
    // Validate
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const fieldsToValidate = ['idRuta', 'nombre', 'paisOrigen', 'estadoOrigen', 'origen', 'paisDestino', 'estadoDestino', 'destino', 'tipo', 'estado'];
    
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg">
          <h3 className="text-base font-semibold">
            {currentRuta ? "Editar Ruta" : "Nueva Ruta"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Ruta *
                </label>
                <input
                  type="text"
                  name="idRuta"
                  value={formData.idRuta}
                  onChange={handleInputChangeWithValidation}
                  onBlur={handleBlur}
                  className={getFieldClassName('idRuta', errors, touched, 'w-full px-3 py-2 border rounded-md')}
                  placeholder="Ej: RUT-001"
                />
                <ErrorMessage error={errors.idRuta} touched={touched.idRuta} />
              </div>
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
                  placeholder="Ej: Ruta Atlántico Norte"
                />
                <ErrorMessage error={errors.nombre} touched={touched.nombre} />
              </div>
            </div>

            {/* Sección de Origen */}
            <div className="border-t pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País Origen *
                  </label>
                  <Select
                    name="paisOrigen"
                    value={
                      paises.find(p => p.isoCode === formData.paisOrigen || p.name === formData.paisOrigen) 
                        ? { 
                            value: paises.find(p => p.isoCode === formData.paisOrigen || p.name === formData.paisOrigen).isoCode, 
                            label: paises.find(p => p.isoCode === formData.paisOrigen || p.name === formData.paisOrigen).name 
                          } 
                        : null
                    }
                    onChange={(option) => {
                      const event = { target: { name: 'paisOrigen', value: option ? option.value : '' } };
                      handlePaisOrigenChange(event);
                    }}
                    onBlur={() => handleBlur({ target: { name: 'paisOrigen', value: formData.paisOrigen } })}
                    options={paises.map(pais => ({ value: pais.isoCode, label: pais.name }))}
                    placeholder="Seleccionar país..."
                    isClearable
                    className={errors.paisOrigen && touched.paisOrigen ? 'border-red-500' : ''}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: errors.paisOrigen && touched.paisOrigen ? '#ef4444' : base.borderColor,
                        '&:hover': {
                          borderColor: errors.paisOrigen && touched.paisOrigen ? '#ef4444' : base.borderColor
                        }
                      })
                    }}
                  />
                  <ErrorMessage error={errors.paisOrigen} touched={touched.paisOrigen} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado/Departamento *
                  </label>
                  <Select
                    name="estadoOrigen"
                    value={estadosOrigen.find(e => e.isoCode === formData.estadoOrigen) ? { value: formData.estadoOrigen, label: estadosOrigen.find(e => e.isoCode === formData.estadoOrigen).name } : null}
                    onChange={(option) => {
                      const event = { target: { name: 'estadoOrigen', value: option ? option.value : '' } };
                      handleEstadoOrigenChange(event);
                    }}
                    onBlur={() => handleBlur({ target: { name: 'estadoOrigen', value: formData.estadoOrigen } })}
                    options={estadosOrigen.map(estado => ({ value: estado.isoCode, label: estado.name }))}
                    placeholder={formData.paisOrigen ? "Seleccionar estado..." : "Primero seleccione un país"}
                    isClearable
                    isDisabled={!formData.paisOrigen}
                    className={errors.estadoOrigen && touched.estadoOrigen ? 'border-red-500' : ''}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.estadoOrigen && touched.estadoOrigen ? '#ef4444' : base.borderColor,
                      })
                    }}
                  />
                  <ErrorMessage error={errors.estadoOrigen} touched={touched.estadoOrigen} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad Origen *
                  </label>
                  <Select
                    name="origen"
                    value={ciudadesOrigen.find(c => c.name === formData.origen) ? { value: formData.origen, label: formData.origen } : null}
                    onChange={(option) => {
                      const event = { target: { name: 'origen', value: option ? option.value : '' } };
                      handleInputChangeWithValidation(event);
                    }}
                    onBlur={() => handleBlur({ target: { name: 'origen', value: formData.origen } })}
                    options={ciudadesOrigen.map(ciudad => ({ value: ciudad.name, label: ciudad.name }))}
                    placeholder={formData.estadoOrigen ? "Seleccionar ciudad..." : "Primero seleccione un estado"}
                    isClearable
                    isDisabled={!formData.estadoOrigen}
                    className={errors.origen && touched.origen ? 'border-red-500' : ''}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.origen && touched.origen ? '#ef4444' : base.borderColor,
                      })
                    }}
                  />
                  <ErrorMessage error={errors.origen} touched={touched.origen} />
                </div>
              </div>
            </div>

            {/* Sección de Destino */}
            <div className="border-t pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País Destino *
                  </label>
                  <Select
                    name="paisDestino"
                    value={
                      paises.find(p => p.isoCode === formData.paisDestino || p.name === formData.paisDestino) 
                        ? { 
                            value: paises.find(p => p.isoCode === formData.paisDestino || p.name === formData.paisDestino).isoCode, 
                            label: paises.find(p => p.isoCode === formData.paisDestino || p.name === formData.paisDestino).name 
                          } 
                        : null
                    }
                    onChange={(option) => {
                      const event = { target: { name: 'paisDestino', value: option ? option.value : '' } };
                      handlePaisDestinoChange(event);
                    }}
                    onBlur={() => handleBlur({ target: { name: 'paisDestino', value: formData.paisDestino } })}
                    options={paises.map(pais => ({ value: pais.isoCode, label: pais.name }))}
                    placeholder="Seleccionar país..."
                    isClearable
                    className={errors.paisDestino && touched.paisDestino ? 'border-red-500' : ''}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.paisDestino && touched.paisDestino ? '#ef4444' : base.borderColor,
                      })
                    }}
                  />
                  <ErrorMessage error={errors.paisDestino} touched={touched.paisDestino} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado/Departamento *
                  </label>
                  <Select
                    name="estadoDestino"
                    value={estadosDestino.find(e => e.isoCode === formData.estadoDestino) ? { value: formData.estadoDestino, label: estadosDestino.find(e => e.isoCode === formData.estadoDestino).name } : null}
                    onChange={(option) => {
                      const event = { target: { name: 'estadoDestino', value: option ? option.value : '' } };
                      handleEstadoDestinoChange(event);
                    }}
                    onBlur={() => handleBlur({ target: { name: 'estadoDestino', value: formData.estadoDestino } })}
                    options={estadosDestino.map(estado => ({ value: estado.isoCode, label: estado.name }))}
                    placeholder={formData.paisDestino ? "Seleccionar estado..." : "Primero seleccione un país"}
                    isClearable
                    isDisabled={!formData.paisDestino}
                    className={errors.estadoDestino && touched.estadoDestino ? 'border-red-500' : ''}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.estadoDestino && touched.estadoDestino ? '#ef4444' : base.borderColor,
                      })
                    }}
                  />
                  <ErrorMessage error={errors.estadoDestino} touched={touched.estadoDestino} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad Destino *
                  </label>
                  <Select
                    name="destino"
                    value={ciudadesDestino.find(c => c.name === formData.destino) ? { value: formData.destino, label: formData.destino } : null}
                    onChange={(option) => {
                      const event = { target: { name: 'destino', value: option ? option.value : '' } };
                      handleInputChangeWithValidation(event);
                    }}
                    onBlur={() => handleBlur({ target: { name: 'destino', value: formData.destino } })}
                    options={ciudadesDestino.map(ciudad => ({ value: ciudad.name, label: ciudad.name }))}
                    placeholder={formData.estadoDestino ? "Seleccionar ciudad..." : "Primero seleccione un estado"}
                    isClearable
                    isDisabled={!formData.estadoDestino}
                    className={errors.destino && touched.destino ? 'border-red-500' : ''}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.destino && touched.destino ? '#ef4444' : base.borderColor,
                      })
                    }}
                  />
                  <ErrorMessage error={errors.destino} touched={touched.destino} />
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2 text-gray-600"></i>
                Información de la Ruta
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distancia
                  </label>
                  <input
                    type="number"
                    name="distancia"
                    value={formData.distancia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="km"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración
                  </label>
                  <input
                    type="text"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ej: 3 días"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Viajes/Año
                  </label>
                  <input
                    type="number"
                    name="viajesAnio"
                    value={formData.viajesAnio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Tipo y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {opcionesTipos.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
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
                  {opcionesEstados.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.estado} touched={touched.estado} />
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

export default RutasForm;

import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar validación de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación por campo
 * @returns {Object} - Estado y funciones de validación
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Valida un campo individual
   */
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Required
    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.requiredMessage || 'Este campo es requerido';
    }

    // Email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return rules.emailMessage || 'Email inválido';
      }
    }

    // Min length
    if (rules.minLength && value && value.length < rules.minLength) {
      return rules.minLengthMessage || `Mínimo ${rules.minLength} caracteres`;
    }

    // Max length
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return rules.maxLengthMessage || `Máximo ${rules.maxLength} caracteres`;
    }

    // Pattern
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.patternMessage || 'Formato inválido';
    }

    // Number
    if (rules.number && value && isNaN(value)) {
      return rules.numberMessage || 'Debe ser un número';
    }

    // Min value
    if (rules.min !== undefined && value && Number(value) < rules.min) {
      return rules.minMessage || `Valor mínimo: ${rules.min}`;
    }

    // Max value
    if (rules.max !== undefined && value && Number(value) > rules.max) {
      return rules.maxMessage || `Valor máximo: ${rules.max}`;
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  /**
   * Valida todos los campos del formulario
   */
  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);

  /**
   * Maneja el blur de un campo
   */
  const handleBlur = useCallback((fieldName, value) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [validateField]);

  /**
   * Maneja el cambio de un campo
   */
  const handleChange = useCallback((fieldName, value) => {
    // Limpiar error si el campo ya fue tocado
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [touched, validateField]);

  /**
   * Resetea el estado de validación
   */
  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  /**
   * Obtiene las clases CSS para un campo
   */
  const getFieldClassName = useCallback((fieldName, baseClassName = '') => {
    const hasError = touched[fieldName] && errors[fieldName];
    const errorClass = hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300';
    return `${baseClassName} ${errorClass}`.trim();
  }, [errors, touched]);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    resetValidation,
    getFieldClassName,
  };
};

/**
 * Obtiene las clases CSS para un campo (función standalone)
 */
export const getFieldClassName = (fieldName, errors, touched, baseClassName = 'w-full px-3 py-2 border rounded-md') => {
  const hasError = touched[fieldName] && errors[fieldName];
  const errorClass = hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300';
  return `${baseClassName} ${errorClass}`.trim();
};

/**
 * Componente de mensaje de error
 */
export const ErrorMessage = ({ error, touched }) => {
  if (!touched || !error) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600">
      {error}
    </p>
  );
};

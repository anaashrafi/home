import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Simple encryption/decryption for sensitive data
 * Note: This is basic obfuscation, not cryptographically secure
 */
const simpleEncrypt = (text, key = 'portfolio-app') => {
  try {
    return btoa(
      text
        .split('')
        .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
        .join('')
    );
  } catch {
    return text;
  }
};

const simpleDecrypt = (encryptedText, key = 'portfolio-app') => {
  try {
    return atob(encryptedText)
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join('');
  } catch {
    return encryptedText;
  }
};

/**
 * Modern localStorage hook with encryption, validation, and sync
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @param {object} options - Configuration options
 * @returns {array} [value, setValue, removeValue, isLoading, error]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    encrypt = false,
    validator = null,
    serializer = JSON,
    syncAcrossTabs = true,
    errorOnInvalidData = false,
  } = options;

  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialized = useRef(false);

  // Get value from localStorage
  const getValue = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      let parsedValue;
      if (encrypt) {
        const decrypted = simpleDecrypt(item);
        parsedValue = serializer.parse(decrypted);
      } else {
        parsedValue = serializer.parse(item);
      }

      // Validate data if validator is provided
      if (validator && !validator(parsedValue)) {
        if (errorOnInvalidData) {
          throw new Error(`Invalid data for key: ${key}`);
        }
        console.warn(`Invalid data found for key: ${key}, using initial value`);
        return initialValue;
      }

      return parsedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setError(error);
      return initialValue;
    }
  }, [key, initialValue, encrypt, validator, serializer, errorOnInvalidData]);

  // Set value to localStorage
  const setValue = useCallback((value) => {
    try {
      setError(null);

      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Validate before storing
      if (validator && !validator(valueToStore)) {
        throw new Error(`Invalid data provided for key: ${key}`);
      }

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        let stringValue = serializer.stringify(valueToStore);

        if (encrypt) {
          stringValue = simpleEncrypt(stringValue);
        }

        window.localStorage.setItem(key, stringValue);

        // Dispatch custom event for cross-tab sync
        if (syncAcrossTabs) {
          window.dispatchEvent(
            new CustomEvent('localStorage-change', {
              detail: { key, value: valueToStore },
            })
          );
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, storedValue, encrypt, validator, serializer, syncAcrossTabs]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);

        if (syncAcrossTabs) {
          window.dispatchEvent(
            new CustomEvent('localStorage-change', {
              detail: { key, value: undefined },
            })
          );
        }
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, initialValue, syncAcrossTabs]);

  // Initialize value from localStorage
  useEffect(() => {
    if (!isInitialized.current) {
      const value = getValue();
      setStoredValue(value);
      setIsLoading(false);
      isInitialized.current = true;
    }
  }, [getValue]);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e) => {
      if (e.key === key) {
        const newValue = getValue();
        setStoredValue(newValue);
      }
    };

    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange);
    };
  }, [key, getValue, initialValue, syncAcrossTabs]);

  return [storedValue, setValue, removeValue, isLoading, error];
};

/**
 * Hook for managing multiple localStorage values
 * @param {object} keys - Object with key-value pairs
 * @param {object} options - Configuration options
 * @returns {object} Storage utilities
 */
export const useMultipleLocalStorage = (keys) => {
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadValues = async () => {
      const loadedValues = {};
      const loadedErrors = {};

      for (const [key, initialValue] of Object.entries(keys)) {
        try {
          const item = localStorage.getItem(key);
          loadedValues[key] = item ? JSON.parse(item) : initialValue;
        } catch (error) {
          loadedErrors[key] = error;
          loadedValues[key] = initialValue;
        }
      }

      setValues(loadedValues);
      setErrors(loadedErrors);
      setIsLoading(false);
    };

    loadValues();
  }, [keys]);

  const setValue = useCallback((key, value) => {
    try {
      const valueToStore = value instanceof Function ? value(values[key]) : value;

      setValues(prev => ({ ...prev, [key]: valueToStore }));
      localStorage.setItem(key, JSON.stringify(valueToStore));

      // Clear error for this key
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: error }));
    }
  }, [values]);

  const removeValue = useCallback((key) => {
    try {
      setValues(prev => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
      localStorage.removeItem(key);

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: error }));
    }
  }, []);

  const clearAll = useCallback(() => {
    Object.keys(keys).forEach(key => {
      localStorage.removeItem(key);
    });
    setValues({});
    setErrors({});
  }, [keys]);

  return {
    values,
    setValue,
    removeValue,
    clearAll,
    isLoading,
    errors,
  };
};

/**
 * Hook for localStorage with expiration
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @param {number} ttl - Time to live in milliseconds
 * @returns {array} [value, setValue, removeValue, isExpired]
 */
export const useLocalStorageWithExpiry = (key, initialValue, ttl = 24 * 60 * 60 * 1000) => {
  const [value, setValue, removeValue, isLoading, error] = useLocalStorage(
    key,
    { value: initialValue, timestamp: Date.now() },
    {
      validator: (data) => data && typeof data === 'object' && 'value' in data && 'timestamp' in data,
    }
  );

  const isExpired = value && Date.now() - value.timestamp > ttl;

  const setValueWithTimestamp = useCallback((newValue) => {
    setValue({
      value: newValue,
      timestamp: Date.now(),
    });
  }, [setValue]);

  // Auto-remove expired values
  useEffect(() => {
    if (isExpired) {
      removeValue();
    }
  }, [isExpired, removeValue]);

  return [
    isExpired ? initialValue : value?.value ?? initialValue,
    setValueWithTimestamp,
    removeValue,
    isExpired,
    isLoading,
    error,
  ];
};
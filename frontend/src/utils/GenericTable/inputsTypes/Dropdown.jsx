import React, { useState, useEffect } from 'react';
import { httpService } from '../../../services/api/httpService';

const Dropdown = ({ endpoint, displayValue, onChange, value }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await httpService.get(endpoint);
        setOptions(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching data from ${endpoint}:`, err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) {
    return <option>Cargando...</option>;
  }

  if (error) {
    return <option>Error: {error.message}</option>;
  }

  return (
    <select onChange={onChange} value={value}>
      <option value="">Seleccione una opción</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option[displayValue] || option.supplier_name || option.code}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

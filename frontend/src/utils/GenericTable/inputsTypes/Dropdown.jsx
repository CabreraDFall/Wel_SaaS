import React, { useState, useEffect } from 'react';
import { httpService } from '../../../services/api/httpService';

const Dropdown = ({ endpoint, displayValue }) => {
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
    <>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name || option.supplier_name || option.code}
        </option>
      ))}
    </>
  );
};

export default Dropdown;

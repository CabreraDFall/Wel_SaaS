import React, { useState, useEffect, useMemo, useCallback } from 'react';
import "./generateLabels.css";
import PrintLabels from '../../../components/PrintLabels';

const GenerateLabels = ({ productName, productCode, udm, format, productId, purchase_order }) => {
  const [formData, setFormData] = useState({
    warehouse: '',
    quantity: ''
  });
  const [warehouses, setWarehouses] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLabelsPrinted = (printedLabels) => { // Status: Se agregó la función handleLabelsPrinted
    setLabels(prevLabels => {
      return prevLabels.map(label => {
        const printedLabel = printedLabels.find(printedLabel => printedLabel.id === label.id);
        if (printedLabel) {
          return { ...label, is_printed: true }; // Status: Se marca la etiqueta como impresa
        }
        return label;
      });
    });
  };

  const memoizedLabels = useMemo(() => labels, [labels]);

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/warehouses');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Could not fetch warehouses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLabels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/labels?purchase_order=${purchase_order}&product_id=${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();

      data = await Promise.all(data.map(async (label) => {
        try {
          const productResponse = await fetch(`http://localhost:3000/api/products/${label.product_id}`);
          if (!productResponse.ok) {
            throw new Error(`HTTP error! status: ${productResponse.status}`);
          }
          const productData = await productResponse.json();
          return { ...label, productName: productData.product_name };
        } catch (error) {
          console.error("Could not fetch product details:", error);
          return { ...label, productName: 'Nombre no encontrado' };
        }
      }));

      setLabels(data);
    } catch (error) {
      console.error("Could not fetch labels:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [purchase_order, productId]);

  useEffect(() => {
    fetchWarehouses();
    fetchLabels();
  }, [fetchWarehouses, fetchLabels, purchase_order, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedWarehouse = warehouses.find(warehouse => warehouse.id === formData.warehouse);
      if (!selectedWarehouse) {
        alert('Por favor, selecciona un almacén.');
        return;
      }

      if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
        alert('Please enter a valid positive quantity.');
        return;
      }

      const response = await fetch('http://localhost:3000/api/labels/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          warehouse_id: warehouses.find(warehouse => warehouse.id === formData.warehouse)?.id,
          quantity: parseInt(formData.quantity),
          active: true,
          created_by: "c8340afa-1c17-4333-848d-b17f420dbd2c",
          warehouseNumber: warehouses.find(warehouse => warehouse.id === formData.warehouse)?.warehouse_number,
          productCode: productCode,
          separatorDigit: 1,
          format: format,
          purchase_order: purchase_order
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert('Label generated successfully!');
    } catch (error) {
      console.error("Could not generate label:", error);
      if (error.message === 'Failed to fetch') {
        alert('Could not connect to the server. Please check your network connection.');
      } else {
        alert(`Could not generate label: ${error.message}`);
      }
    }
  };

  return (
    <div className="genarateLabel-contaniner max-w-md mx-auto mt-8 p-6 bg-white justify-center rounded-lg shadow-md flex">
      <form onSubmit={handleSubmit} className='flex flex-col gap-4  items-center'>
        <h2>{productName}</h2>
        <div className="space-y-2 flex gap-2 items-center">
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">
            Almacén
          </label>
          <select
            id="warehouse"
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            className="storage p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona un almacén</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.warehouse_number} - {warehouse.warehouse_name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex gap-2 items-center">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="quantity border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-4 items-center mt-6 ">
          <button
            type="submit"
            className="btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear
          </button>
          <button>
            cancelar
          </button>
        </div>
        <PrintLabels labels={memoizedLabels} onLabelsPrinted={handleLabelsPrinted} /> {/* Status: Se pasó la función handleLabelsPrinted como prop */}
      </form>
    </div>
  );
};

export default GenerateLabels;

import React, { useState } from 'react';

const GenerateLabels = ({ productName, productCode, udm, format }) => {
  const [formData, setFormData] = useState({
    storage: '',
    quantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add the logic to handle the label generation
    console.log('Form data:', {
      ...formData,
      productName,
      productCode,
      udm,
      format
    });
  };

  const handlePrint = () => {
    // Add printing logic here
    console.log('Printing label for:', {
      ...formData,
      productName,
      productCode,
      udm,
      format
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">Nueva etiqueta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Producto
          </label>
          <input
            type="text"
            value={productName}
            disabled
            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            value={productCode}
            disabled
            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            UDM
          </label>
          <input
            type="text"
            value={udm}
            disabled
            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Formato
          </label>
          <input
            type="text"
            value={format}
            disabled
            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="storage" className="block text-sm font-medium text-gray-700">
            Almacen
          </label>
          <input
            type="number"
            id="storage"
            name="storage"
            value={formData.storage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="4"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Imprimir
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateLabels;

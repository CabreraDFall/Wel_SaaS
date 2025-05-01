import React, { useState, useEffect } from 'react';
import "./generateLabels.css";
import { warehouseService } from '../../../services/api/warehouseService';
import barcodeService from '../../../services/api/barcodeService';
import labelService from '../../../services/api/labelService';

const GenerateLabels = ({ productName, productCode, udm, format, productId, purchase_order }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await warehouseService.getAll();
        setWarehouses(data);
      } catch (error) {
        console.error("Could not fetch warehouses:", error);
      }
    };

    fetchWarehouses();
  }, []);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  return (
    <div className="genarateLabel-contaniner max-w-md mx-auto mt-8 p-6 bg-white justify-center rounded-lg shadow-md flex">
      <form className='flex flex-col gap-4  items-center'>
        <h2>{productName}</h2>
        <div className="space-y-2 flex gap-2 items-center">
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">
            Almacén
          </label>
          <select
            id="warehouse"
            name="warehouse"
            className="storage p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={handleWarehouseChange}
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
            className="quantity border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={handleQuantityChange}
          />
        </div>
        <div className="flex flex-col gap-4 items-center mt-6 ">
          <button
            type="button"
            className="btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              const warehouse = warehouses.find(w => w.id === selectedWarehouse);
              const warehouseNumber = warehouse ? parseInt(warehouse.warehouse_number) : null;

              console.log("productName:", productName);
              console.log("productCode:", productCode);
              console.log("udm:", udm);
              console.log("format:", format);
              console.log("productId:", productId);
              console.log("purchase_order:", purchase_order);
              console.log("warehouseNumber:", warehouseNumber);
              console.log("quantity:", quantity);

              barcodeService.generateBarcode(
                warehouseNumber,
                parseInt(productCode),
                1,
                format,
                productId,
                purchase_order,
                quantity,
                selectedWarehouse
              )
                .then(label => {
                  console.log("Etiqueta creada:", label);
                  alert("Etiqueta creada exitosamente!");
                })
                .catch(error => {
                  console.error("Error al crear la etiqueta:", error);
                  alert("Error al crear la etiqueta.");
                });
            }}
          >
            Crear
          </button>
          <button>
            cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateLabels;

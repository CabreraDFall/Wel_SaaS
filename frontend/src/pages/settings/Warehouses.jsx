import React, { useState, useEffect } from 'react';
import { warehouseService } from '../../services/api/warehouseService';
import GenericTable from '../../utils/GenericTable/GenericTable';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columnTitles = [
    "Nombre",
    "Número"
  ];

  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const data = await warehouseService.getAll();
        setWarehouses(data);
        setTotalPages(1); // Ajustar si la API devuelve paginación
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    }

    fetchWarehouses();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [showNewForm, setShowNewForm] = useState(false);

  const handleAgregarNuevo = () => {
    setShowNewForm(true);
  };

  const [newWarehouse, setNewWarehouse] = useState({
    warehouse_name: '',
    warehouse_number: ''
  });

  let newFormInputs = [];
  let handleInputChange = (e, name) => {
    setNewWarehouse(prev => ({ ...prev, [name]: e.target.value }));
  };

  let handleSave = () => { };
  let handleCancel = () => { };

  if (showNewForm) {
    handleSave = () => {
      if (!newWarehouse.warehouse_name || !newWarehouse.warehouse_number) {
        alert('El nombre y el número del almacén son requeridos');
        return;
      }

      const warehouseNumber = parseInt(newWarehouse.warehouse_number, 10);

      if (isNaN(warehouseNumber)) {
        alert('El número de almacén debe ser un número entero válido');
        return;
      }

      warehouseService.create({ ...newWarehouse, warehouse_number: warehouseNumber })
        .then(newWarehouse => {
          setWarehouses([...warehouses, newWarehouse]);
          setNewWarehouse({
            warehouse_name: '',
            warehouse_number: '',
            description: ''
          });
          setShowNewForm(false);
        });
    };

    handleCancel = () => {
      setNewWarehouse({
        warehouse_name: '',
        warehouse_number: ''
      });
      setShowNewForm(false);
    };

    newFormInputs = [
      { type: 'text', name: 'warehouse_name', value: newWarehouse.warehouse_name, onChange: handleInputChange },
      { type: 'number', name: 'warehouse_number', value: newWarehouse.warehouse_number, onChange: handleInputChange }
    ];
  }

  const elements = warehouses.map(warehouse => ({
    warehouse_name: warehouse.warehouse_name,
    warehouse_number: warehouse.warehouse_number
  }));

  return (
    <div className='products-container flex flex-col gap-4'>
      <h2>Almacenes</h2>
      <div className='products-header flex justify-between items-center'>
        <button onClick={handleAgregarNuevo}>Agregar nuevo</button>
      </div>
      <GenericTable
        elements={elements}
        columnTitles={columnTitles}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        newFormInputs={showNewForm ? newFormInputs : null}
      />
    </div>
  );
}

export default Warehouses;

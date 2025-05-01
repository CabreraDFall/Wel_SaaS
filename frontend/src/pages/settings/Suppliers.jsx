import React, { useState, useEffect } from 'react';
import { supplierService } from '../../services/api/supplierService';
import GenericTable from '../../utils/genericTable/GenericTable';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columnTitles = ["Nombre", "Contacto", "Dirección", "Teléfono", "Descripción"];

  useEffect(() => {
    supplierService.getSuppliers()
      .then(data => {
        setSuppliers(data);
        setTotalPages(1); // Ajustar según la paginación real del backend
      });
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Aquí deberías llamar a tu servicio para obtener los proveedores de la página 'newPage'
    // y actualizar el estado 'suppliers'
  };

  const [showNewForm, setShowNewForm] = useState(false);

  const handleAgregarNuevo = () => {
    setShowNewForm(true);
  };

  const [newSupplier, setNewSupplier] = useState({
    supplier_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    description: ''
  });
  let newFormInputs = [];
  let handleInputChange = (e, name) => {
    setNewSupplier(prev => ({ ...prev, [name]: e.target.value }));
  };
  let handleSave = () => {};
  let handleCancel = () => {};

  if (showNewForm) {
    handleSave = () => {
      if (!newSupplier.supplier_name || !newSupplier.description) {
        alert('El nombre del proveedor y la descripción son requeridos');
        return;
      }

      supplierService.createSupplier(newSupplier)
        .then(newSupplier => {
          setSuppliers([...suppliers, newSupplier]);
          setNewSupplier({
            supplier_name: '',
            contact_name: '',
            contact_email: '',
            contact_phone: '',
            description: ''
          });
        });
    };

    handleCancel = () => {
      setNewSupplier({
        supplier_name: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        description: ''
      });
      setShowNewForm(false);
    };

    newFormInputs = [
      { type: 'text', name: 'supplier_name', value: newSupplier.supplier_name, onChange: handleInputChange },
      { type: 'text', name: 'contact_name', value: newSupplier.contact_name, onChange: handleInputChange },
      { type: 'text', name: 'contact_email', value: newSupplier.contact_email, onChange: handleInputChange },
      { type: 'text', name: 'contact_phone', value: newSupplier.contact_phone, onChange: handleInputChange },
      { type: 'text', name: 'description', value: newSupplier.description, onChange: handleInputChange }
    ];
  }

  const supplierData = suppliers.map(supplier => ({
    Nombre: supplier.supplier_name,
    Contacto: supplier.contact_name,
    Dirección: supplier.contact_email,
    Teléfono: supplier.contact_phone,
    Descripción: supplier.description
  }));

  return (
    <div className='products-container flex flex-col gap-4'>
      <h2>Proveedores</h2>
      <div className='products-header flex justify-between items-center'>
        <button onClick={handleAgregarNuevo}>Agregar nuevo</button>
      </div>
      <GenericTable
        elements={supplierData}
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

export default Suppliers;

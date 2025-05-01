import React, { useState, useEffect } from 'react';
import { supplierService } from '../../services/api/supplierService';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    supplierService.getSuppliers()
      .then(data => setSuppliers(data));
  }, []);

  return (
    <div>
      <h2>Proveedores</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.id}>
              <td>{supplier.supplier_name}</td>
              <td>{supplier.contact_name}</td>
              <td>{supplier.contact_email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Suppliers;

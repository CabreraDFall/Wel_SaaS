import React, { useState, useEffect } from 'react';
import { uomMasterService } from '../../services/api/UomMasterService';
import { uomCategoriesService } from '../../services/api/uomCategoriesService';
import GenericTable from '../../utils/GenericTable/GenericTable';
import Dropdown from '../../utils/genericTable/inputsTypes/Dropdown';

function UomMaster() {
  const [uoms, setUoms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // TODO: Obtener el número total de páginas desde la API
  const [showNewForm, setShowNewForm] = useState(false);
  const [newUom, setNewUom] = useState({
    name: '',
    code: '',
    category_id: ''
  });

  const columnTitles = ["Nombre", "Código", "Categoría"];

  useEffect(() => {
    const fetchUoms = async () => {
      try {
        const data = await uomMasterService.getAll();
        setUoms(data);
        // setTotalPages(data.totalPages); //  TODO: Implementar paginación en el backend
      } catch (error) {
        console.error("Error fetching UOMs:", error);
      }
    };

    fetchUoms();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAgregarNuevo = () => {
    setShowNewForm(true);
  };

  const uomsData = uoms.map(uom => ({
    Nombre: uom.name,
    Código: uom.code,
    Categoría: uom.category_name
  }));

  return (
    <div>
      <h2>Unidades de Medida Maestras</h2>
      {/* Implementar la tabla y el formulario CRUD aquí */}
      <div className='products-header flex justify-between items-center'>
        <button onClick={handleAgregarNuevo}>Agregar nuevo</button>
      </div>
      <GenericTable
        elements={uomsData}
        columnTitles={columnTitles}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handleInputChange={showNewForm ? (e, name) => setNewUom(prev => ({ ...prev, [name]: e.target.value })) : undefined}
        handleSave={showNewForm ? () => {
          if (!newUom.name || !newUom.code || !newUom.category_id) {
            alert('Nombre, código y categoría son requeridos');
            return;
          }

          uomMasterService.create(newUom)
            .then(newUom => {
              setUoms([...uoms, newUom]);
              setNewUom({
                name: '',
                code: '',
                category_id: ''
              });
              setShowNewForm(false);
            });
        } : undefined}
        handleCancel={showNewForm ? () => {
          setNewUom({
            name: '',
            code: '',
            category_id: ''
          });
          setShowNewForm(false);
        } : undefined}
        newFormInputs={showNewForm ? [
          { type: 'text', name: 'name', value: newUom.name, onChange: (e, name) => setNewUom(prev => ({ ...prev, [name]: e.target.value })) },
          { type: 'text', name: 'code', value: newUom.code, onChange: (e, name) => setNewUom(prev => ({ ...prev, [name]: e.target.value })) },
          {
            type: 'dropdown',
            name: 'category_id',
            endpoint: '/uom_categories',
            displayValue: 'name',
            value: newUom.category_id,
            onChange: (e, name) => setNewUom(prev => ({ ...prev, [name]: e.target.value }))
          }
        ] : null}
      />
    </div>
  );
}

export default UomMaster;

import React, { useState, useEffect } from 'react';
import { uomCategoriesService } from '../../services/api/uomCategoriesService';
import GenericTable from '../../utils/genericTable/GenericTable';

function UomCategories() {
  const [categories, setCategories] = useState([]);
  const [columnTitles, setColumnTitles] = useState(['Nombre', 'Descripción']);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await uomCategoriesService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching UOM categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleAgregarNuevo = () => {
    setShowNewForm(true);
  };

  let newFormInputs = [];
  let handleInputChange = (e, name) => {
    setNewCategory(prev => ({ ...prev, [name]: e.target.value }));
  };

  let handleSave = () => {};
  let handleCancel = () => {};

  if (showNewForm) {
    handleSave = () => {
      if (!newCategory.name || !newCategory.description) {
        alert('El nombre y la descripción son requeridos');
        return;
      }

      uomCategoriesService.create(newCategory)
        .then(newCategory => {
          setCategories([...categories, newCategory]);
          setNewCategory({
            name: '',
            description: ''
          });
          setShowNewForm(false);
        });
    };

    handleCancel = () => {
      setNewCategory({
        name: '',
        description: ''
      });
      setShowNewForm(false);
    };

    newFormInputs = [
      { type: 'text', name: 'name', value: newCategory.name, onChange: handleInputChange },
      { type: 'text', name: 'description', value: newCategory.description, onChange: handleInputChange }
    ];
  }

  // Formatear los datos para que coincidan con la estructura esperada por GenericTable
  const formattedCategories = categories.map(category => ({
    Nombre: category.name,
    Descripción: category.description
  }));

  return (
    <div>
      <h2>Categorías de Unidades de Medida</h2>
      <button onClick={handleAgregarNuevo}>Agregar Nueva</button>
      <GenericTable
        elements={formattedCategories}
        columnTitles={columnTitles}
        newFormInputs={showNewForm ? newFormInputs : null}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </div>
  );
}

export default UomCategories;

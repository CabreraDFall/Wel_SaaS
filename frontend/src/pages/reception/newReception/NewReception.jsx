import React, { useState, useEffect } from 'react';
import './newReception.css';
import Sidebar from '../../../components/sidebar/Sidebar';
import Navbar from '../../../components/navBar/Navbar';
import { Link, useParams } from 'react-router-dom';
import labelService from '../../../services/api/labelService';

function NewReception() {
  const { purchase_order } = useParams();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await labelService.getLabelsByPurchaseOrder(purchase_order);
        console.log('API data:', response); // Imprimir los datos de la API
        setLabels(response.data || []); // Establecer labels a un array vacío si data es null o undefined
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchLabels();
  }, [purchase_order]);

  return (
    <div className='wrapper'>
      <Sidebar />
      <div className='container'>
        <Navbar />
        <div className='reception-container flex flex-col gap-4'>
          <div className='reception-header flex justify-between items-center'>
            <h4>Etiquetas</h4>
            <Link className='reception-header-button' to={`/labels/${purchase_order}`}>Nuevo etiqueta</Link>
          </div>
          {labels.map(label => (
            <div key={label.id} className='label-item'>
              {/* Mostrar la información de la etiqueta aquí */}
              <p>Label ID: {label.id}</p>
              {/* Agregar más detalles de la etiqueta según sea necesario */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewReception;

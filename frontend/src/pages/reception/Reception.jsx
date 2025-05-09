import React, { useState, useEffect } from 'react';
import './reception.css'; // Import the CSS file
import Layout from '../../components/Layout';
import SearchIcon from '../../components/icons/SearchIcon';
import CloseContenedorIcon from '../../components/icons/closeContenedor_icon';
import PrintingIcon from '../../components/icons/printing_icon';
import EyesIcon from '../../components/icons/eyes';
import { receptionService } from '../../services/api/receptionService';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../../utils/genericTable/GenericTable';

const Reception = () => {
  const navigate = useNavigate();
  // State declarations
  const [receptions, setReceptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newTrip, setNewTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 3;

  // Fetch receptions on component mount
  useEffect(() => {
    fetchReceptions();
  }, []);

  // Fetch receptions when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchReceptionsByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchReceptions = async () => {
    try {
      setLoading(true);
      const data = await receptionService.getAllReceptions();
      setReceptions(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las recepciones');
      console.error('Error fetching receptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceptionsByDate = async (date) => {
    try {
      setLoading(true);
      const data = await receptionService.getReceptionsByDate(date);
      setReceptions(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las recepciones por fecha');
      console.error('Error fetching receptions by date:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter receptions based on search query and inactive status
  const filteredReceptions = receptions.filter((reception) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (reception.vehicle.toLowerCase().includes(searchLower) ||
      reception.purchase_order.toLowerCase().includes(searchLower)) &&
      !reception.inactive
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredReceptions.length / itemsPerPage);
  const paginatedReceptions = filteredReceptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Event handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value);
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewTrip = async () => {
    const purchaseOrder = ''; // You might want to generate a default purchase order here
    try {
      setNewTrip({
        reception_date: '',
        vehicle: '',
        items: 0,
        purchase_order: purchaseOrder,
        status: 'en camino',
      });
    } catch (error) {
      console.error('Error fetching receptions count:', error);
      setNewTrip({
        reception_date: '',
        vehicle: '',
        items: 0,
        purchase_order: purchaseOrder,
        status: 'en camino',
      });
    }
  };

  const handleInputChange = (e, field) => {
    const value = field === 'items' ? parseInt(e.target.value, 10) : e.target.value;
    setNewTrip({ ...newTrip, [field]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulating the user ID. Replace with actual user ID retrieval logic.
      const userId = '4f314e72-ebd0-4a2c-bb40-86cc8d54a58f';
      const purchaseOrder = newTrip.purchase_order;

      await receptionService.createReception({ ...newTrip, items: 0, created_by: userId });
      setNewTrip(null);
      await fetchReceptions(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Error al guardar la recepción');
      console.error('Error saving reception:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      setLoading(true);
      // Get the reception to update
      const receptionToUpdate = receptions.find((reception) => reception.id === id);
      if (!receptionToUpdate) {
        setError('Recepción no encontrada');
        return;
      }

      // Update the status to "descargando"
      await receptionService.updateReception(id, { ...receptionToUpdate, status: 'descargando' });
      await fetchReceptions(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Error al actualizar el estado de la recepción');
      console.error('Error updating reception status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta recepción?')) {
      try {
        setLoading(true);
        await receptionService.deleteReception(id);
        await fetchReceptions(); // Refresh the list
        setError(null);
      } catch (err) {
        setError('Error al eliminar la recepción');
        console.error('Error deleting reception:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setNewTrip(null);
  };

  const handleReceptionClick = (rowClickDestination) => {
    navigate(rowClickDestination);
  };

  // Column titles for GenericTable
  const columnTitles = ['Orden de compra', 'Vehiculo', 'Items', 'Fecha', 'Estatus', ''];

  // Prepare data for GenericTable
  const receptionsData = paginatedReceptions.map((reception) => ({
    ordenDeCompra: reception.purchase_order,
    vehiculo: reception.vehicle,
    items: reception.items,
    fecha: new Date(reception.reception_date).toLocaleDateString(),
    estatus: reception.status,
    acciones: (
      <div className='flex gap-4'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (reception.status !== 'descargando') {
              handleUpdateStatus(reception.id);
            }
          }}
          disabled={reception.status === 'descargando'}
        >
          <CloseContenedorIcon />
        </button>
        <button onClick={(e) => e.stopPropagation()} disabled><PrintingIcon /></button>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            // Obtener el ID del usuario actual
            const userId = '4f314e72-ebd0-4a2c-bb40-86cc8d54a58f'; //getCurrentUserId(); // Reemplazar con la lógica real para obtener el ID del usuario

            // Actualizar el estado de la recepción
            try {
              setLoading(true);
              await receptionService.updateReception(reception.id, {
                ...reception,
                inactive: true,
                inactive_by: userId,
              });

              // Actualizar el estado local
              setReceptions(
                receptions.map((r) =>
                  r.id === reception.id ? { ...r, inactive: true, inactive_by: userId } : r
                )
              );
              setError(null);
            } catch (err) {
              setError('Error al actualizar la recepción');
              console.error('Error updating reception:', err);
            } finally {
              setLoading(false);
            }
          }}
        >
          <EyesIcon />
        </button>
      </div>
    ),
  }));

  // New trip form inputs for GenericTable
  const newTripInputs = newTrip ? [
    { type: 'text', name: 'purchase_order', value: newTrip.purchase_order, onChange: handleInputChange, placeholder: 'Orden de compra' },
    { type: 'text', name: 'vehicle', value: newTrip.vehicle, onChange: handleInputChange, placeholder: 'Vehiculo' },
    { type: 'text', name: 'items', value: newTrip.items, readOnly: true, placeholder: 'Items' },
    { type: 'date', name: 'reception_date', value: newTrip.reception_date, onChange: handleInputChange },
    {
      type: 'select',
      name: 'status',
      value: newTrip.status,
      onChange: handleInputChange,
      options: [
        { id: 'descargando', name: 'Descargando' },
        { id: 'finalizado', name: 'Finalizado' },
        { id: 'en camino', name: 'En camino' },
      ],
    },
  ] : null;

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Layout>
      <div className='reception-container flex flex-col gap-4'>
        <div className='reception-header flex justify-between items-center'>
          <h4>Recepción</h4>
          <button onClick={handleNewTrip}>Nuevo viaje</button>
        </div>
        <div className='reception-filters flex justify-between items-center'>
          <div className='search-container'>
            <div className="search-wrapper">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar pedido"
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="calendar-container">
            <button className="calendar-btn" onClick={toggleDatePicker}>
              <span>{selectedDate || 'Calendario'}</span>
            </button>
            {showDatePicker && (
              <div className="date-picker-dropdown">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateSelect}
                  className="date-input"
                />
              </div>
            )}
          </div>
        </div>
        <div className='reception-body'>
          <div className='reception-table'>
            <GenericTable
              elements={receptionsData}
              columnTitles={columnTitles}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              newFormInputs={newTripInputs}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleReceptionClick={handleReceptionClick}
              rowClickDestination={(reception) =>
                reception.estatus === 'descargando' ? `/reception/${reception.ordenDeCompra}` : null
              }
              rowStyle={(reception) => ({
                cursor: reception.estatus !== 'descargando' ? 'normal' : 'pointer',
              })}
            />
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reception;

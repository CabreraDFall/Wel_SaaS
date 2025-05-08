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

  // Filter receptions based on search query
  const filteredReceptions = receptions.filter((reception) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      reception.vehicle.toLowerCase().includes(searchLower) ||
      reception.purchase_order.toLowerCase().includes(searchLower)
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

  const handleNewTrip = () => {
    setNewTrip({
      reception_date: '',
      vehicle: '',
      items: '',
      purchase_order: '',
      status: 'descargando',
    });
  };

  const handleInputChange = (e, field) => {
    setNewTrip({ ...newTrip, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulating the user ID. Replace with actual user ID retrieval logic.
      const userId = '50ce4f37-91cc-43ee-814e-0850c783b67d';
      await receptionService.createReception({ ...newTrip, created_by: userId });
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
  const columnTitles = ['Fecha', 'Vehiculo', 'Items', 'Orden de compra', 'Estatus', ''];

  // Prepare data for GenericTable
  const receptionsData = paginatedReceptions.map((reception) => ({
    fecha: new Date(reception.reception_date).toLocaleDateString(),
    vehiculo: reception.vehicle,
    items: reception.items,
    ordenDeCompra: reception.purchase_order,
    estatus: reception.status,
    acciones: (
      <div className='flex gap-4'>
        <button onClick={(e) => {
          e.stopPropagation();
          handleDelete(reception.id);
        }}><CloseContenedorIcon /></button>
        <button onClick={(e) => e.stopPropagation()}><PrintingIcon /></button>
        <button onClick={(e) => e.stopPropagation()}><EyesIcon /></button>
      </div>
    ),
  }));

  // New trip form inputs for GenericTable
  const newTripInputs = newTrip ? [
    { type: 'date', name: 'reception_date', value: newTrip.reception_date, onChange: handleInputChange },
    { type: 'text', name: 'vehicle', value: newTrip.vehicle, onChange: handleInputChange, placeholder: 'Vehiculo' },
    { type: 'number', name: 'items', value: newTrip.items, onChange: handleInputChange, placeholder: 'Items' },
    { type: 'text', name: 'purchase_order', value: newTrip.purchase_order, onChange: handleInputChange, placeholder: 'Orden de compra' },
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
              rowClickDestination={(reception) => `/reception/${reception.ordenDeCompra}`}
            />
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reception;

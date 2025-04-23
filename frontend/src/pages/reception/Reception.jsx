import React, { useState, useEffect } from 'react'
import './reception.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'
import CloseContenedorIcon from '../../components/icons/closeContenedor_icon'
import PrintingIcon from '../../components/icons/printing_icon'
import EyesIcon from '../../components/icons/eyes'
import { receptionService } from '../../services/api/receptionService'
import { useNavigate } from 'react-router-dom'

const Reception = () => {
  const navigate = useNavigate()
  // State declarations
  const [receptions, setReceptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [newTrip, setNewTrip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const itemsPerPage = 3

  // Fetch receptions on component mount
  useEffect(() => {
    fetchReceptions()
  }, [])

  // Fetch receptions when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchReceptionsByDate(selectedDate)
    }
  }, [selectedDate])

  const fetchReceptions = async () => {
    try {
      setLoading(true)
      const data = await receptionService.getAllReceptions()
      setReceptions(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar las recepciones')
      console.error('Error fetching receptions:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReceptionsByDate = async (date) => {
    try {
      setLoading(true)
      const data = await receptionService.getReceptionsByDate(date)
      setReceptions(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar las recepciones por fecha')
      console.error('Error fetching receptions by date:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter receptions based on search query
  const filteredReceptions = receptions.filter(reception => {
    const searchLower = searchQuery.toLowerCase()
    return reception.vehicle.toLowerCase().includes(searchLower) ||
           reception.purchase_order.toLowerCase().includes(searchLower)
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredReceptions.length / itemsPerPage)
  const paginatedReceptions = filteredReceptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Event handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value)
    setShowDatePicker(false)
    setCurrentPage(1)
  }

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleNewTrip = () => {
    setNewTrip({ 
      reception_date: '', 
      vehicle: '', 
      items: '', 
      purchase_order: '', 
      status: 'descargando' 
    })
  }

  const handleInputChange = (e, field) => {
    setNewTrip({ ...newTrip, [field]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // Simulating the user ID. Replace with actual user ID retrieval logic.
      const userId = "c8340afa-1c17-4333-848d-b17f420dbd2c"; 
      await receptionService.createReception({...newTrip, created_by: userId})
      setNewTrip(null)
      await fetchReceptions() // Refresh the list
      setError(null)
    } catch (err) {
      setError('Error al guardar la recepción')
      console.error('Error saving reception:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta recepción?')) {
      try {
        setLoading(true)
        await receptionService.deleteReception(id)
        await fetchReceptions() // Refresh the list
        setError(null)
      } catch (err) {
        setError('Error al eliminar la recepción')
        console.error('Error deleting reception:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setNewTrip(null)
  }

  const handleReceptionClick = (purchase_order) => {
    navigate(`/reception/${purchase_order}`)
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className='wrapper'>
        <Sidebar />        
        <div className='container'>
          <Navbar />
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
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Vehiculo</th>
                      <th>Items</th>
                      <th>Orden de compra</th>
                      <th>Estatus</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newTrip && (
                      <tr>
                        <td><input type="date" value={newTrip.reception_date} onChange={(e) => handleInputChange(e, 'reception_date')} /></td>
                        <td><input type="text" value={newTrip.vehicle} onChange={(e) => handleInputChange(e, 'vehicle')} placeholder="Vehiculo" /></td>
                        <td><input type="number" value={newTrip.items} onChange={(e) => handleInputChange(e, 'items')} placeholder="Items" /></td>
                        <td><input type="text" value={newTrip.purchase_order} onChange={(e) => handleInputChange(e, 'purchase_order')} placeholder="Orden de compra" /></td>
                        <td>
                          <select value={newTrip.status} onChange={(e) => handleInputChange(e, 'status')}>
                            <option value="descargando">Descargando</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="en camino">En camino</option>
                          </select>
                        </td>
                        <td className='flex gap-4'>
                          <button onClick={handleSave} className="save-btn">Guardar</button>
                          <button onClick={handleCancel} className="cancel-btn">Cancelar</button>
                        </td>
                      </tr>
                    )}
                    {paginatedReceptions.map((reception) => (
                      <tr key={reception.id} onClick={() => handleReceptionClick(reception.purchase_order)} style={{ cursor: 'pointer' }}>
                        <td>{new Date(reception.reception_date).toLocaleDateString()}</td>
                        <td>{reception.vehicle}</td>
                        <td>{reception.items}</td>
                        <td>{reception.purchase_order}</td>
                        <td>{reception.status}</td>
                        <td className='flex gap-4'>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(reception.id)}}><CloseContenedorIcon /></button>
                          <button onClick={(e) => e.stopPropagation()}><PrintingIcon /></button>
                          <button onClick={(e) => e.stopPropagation()}><EyesIcon /></button>
                        </td>                        
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination-container flex justify-between items-center">
                  <div className="pagination-info">
                    Página {currentPage} - {totalPages}
                  </div>
                  <div className="pagination-controls flex gap-4">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Anterior
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Reception

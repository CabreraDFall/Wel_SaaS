import React, { useState } from 'react'
import './reception.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'
import CloseContenedorIcon from '../../components/icons/closeContenedor_icon'
import PrintingIcon from '../../components/icons/printing_icon'
import EyesIcon from '../../components/icons/eyes'

const Reception = () => {
  // All products data
  const allReceptions = [
    {
      fecha: '2025-01-01',
      vehiculo: 'AA351558',    
      items: '120',
      orden: 'PO 26032021-000001',
      estatus: 'Descargando',
    }, 
    {
        fecha: '2025-01-01',
        vehiculo: 'AA351559',    
        items: '120',
        orden: 'PO 26032021-000002',
        estatus: 'Descargando',
      },
      {
        fecha: '2025-01-01',
        vehiculo: 'AA351560',    
        items: '120',
        orden: 'PO 26032021-000003',
        estatus: 'Descargando',
    },
  ]

  // State declarations
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Filter products based on search query and date
  const filteredReceptions = allReceptions.filter(reception => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      reception.vehiculo.toLowerCase().includes(searchLower) ||
      reception.orden.toLowerCase().includes(searchLower)
    const matchesDate = selectedDate ? reception.fecha === selectedDate : true
    return matchesSearch && matchesDate
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
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value)
    setShowDatePicker(false)
    setCurrentPage(1) // Reset to first page when changing date
  }

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='wrapper'>
        <Sidebar />        
        <div className='container'>
          <Navbar />
          <div className='reception-container flex flex-col gap-4'>
            <div className='reception-header flex justify-between items-center'>
              <h4>Recepción</h4>
              <button>Nuevo pedido</button>
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
                    {paginatedReceptions.map((reception, index) => (
                      <tr key={index}>
                        <td>{reception.fecha}</td>
                        <td>{reception.vehiculo}</td>
                        <td>{reception.items}</td>
                        <td>{reception.orden}</td>
                        <td>{reception.estatus}</td>
                        <td className='flex gap-4'>
                          <CloseContenedorIcon />
                          <PrintingIcon />
                          <EyesIcon />
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
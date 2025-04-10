import React, { useState } from 'react'
import './labels.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'
import CloseContenedorIcon from '../../components/icons/closeContenedor_icon'
import PrintingIcon from '../../components/icons/printing_icon'
import EyesIcon from '../../components/icons/eyes'

const Labels = () => {
  // All products data
  const allLabels = [
    {
      fecha: '2025-01-01',
      barcode: '01-123456789012',
      codigo:"102500100",
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
     
    },
  ]

  // State declarations
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Filter products based on search query and date
  const filteredLabels = allLabels.filter(label => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      label.producto.toLowerCase().includes(searchLower) ||
      label.codigo.toLowerCase().includes(searchLower)
    const matchesDate = selectedDate ? label.fecha === selectedDate : true
    return matchesSearch && matchesDate
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredLabels.length / itemsPerPage)
  const paginatedLabels = filteredLabels.slice(
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
          <div className='products-container flex flex-col gap-4'>
            <div className='products-header flex justify-between items-center'>
              <h4>Etiquetas</h4>
            <button>Nuevo etiqueta</button>
            </div>
            <div className='products-filters flex justify-between items-center'>
              <div className='search-container'>
                <div className="search-wrapper">
                  <SearchIcon />
                  <input 
                    type="text" 
                    placeholder="Buscar etiqueta" 
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
            <div className='products-body'>
              <div className='products-table'>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Barcode</th>
                      <th>Codigo</th>
                      <th>Producto</th>
                      <th>UDM</th>
                      <th>Formato</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLabels.map((label, index) => (
                      <tr key={index}>
                        <td>{label.fecha}</td>  
                        <td>{label.barcode}</td>
                        <td>{label.codigo}</td>
                        <td>{label.producto}</td>
                        <td>{label.udm}</td>
                        <td>{label.formato}</td>
                        <td className='flex gap-4'>
                        <button className="more-options">•••</button>
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

export default Labels
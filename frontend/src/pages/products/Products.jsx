import React, { useState } from 'react'
import './products.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'

const Products = () => {
  // All products data
  const allProducts = [
    {
      codigo: '102500100',
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
      proveedor: 'Juan Pastilzal',
      fecha: '2025-01-01'
    },
    {
      codigo: '102500100',
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
      proveedor: 'Juan Pastilzal',
      fecha: '2025-01-01'
    },
    {
      codigo: '102500100',
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
      proveedor: 'Juan Pastilzal',
      fecha: '2025-01-01'
    },
    {
      codigo: '102500100',
      producto: 'pechuga entero',
      udm: 'libras',
      formato: 'variable',
      proveedor: 'Juan Pastilzal',
      fecha: '2025-01-01'
    },
    {
      codigo: '102500100',
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
      proveedor: 'Juan Pastilzal',
      fecha: '2025-01-01'
    },
    {
      codigo: '102500102',
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
      proveedor: 'Maximo',
      fecha: '2025-01-01'
    }
  ]

  // State declarations
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Filter products based on search query and date
  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase()
<<<<<<< HEAD
    const matchesSearch = 
      product.producto.toLowerCase().includes(searchLower) ||
      product.codigo.toLowerCase().includes(searchLower)
=======
    const matchesSearch = product.producto.toLowerCase().includes(searchLower)
>>>>>>> 12a4bf48120bbb42fa7967eeaa0046bfb9a93987
    const matchesDate = selectedDate ? product.fecha === selectedDate : true
    return matchesSearch && matchesDate
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
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
              <h4>Productos</h4>
              <button>Nuevo productos</button>
            </div>
            <div className='products-filters flex justify-between items-center'>
              <div className='search-container'>
                <div className="search-wrapper">
                  <SearchIcon />
                  <input 
                    type="text" 
                    placeholder="Buscar producto" 
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
                      <th>Codigo</th>
                      <th>Productos</th>
                      <th>UDM</th>
                      <th>Formato</th>
                      <th>Proveedor</th>
                      <th>Fecha</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.codigo}</td>
                        <td>{product.producto}</td>
                        <td>{product.udm}</td>
                        <td>{product.formato}</td>
                        <td>{product.proveedor}</td>
                        <td>{product.fecha}</td>
                        <td>
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

export default Products
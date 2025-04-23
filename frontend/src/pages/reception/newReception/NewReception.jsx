import React, { useState, useEffect } from 'react'
import './newReception.css'
import Sidebar from '../../../components/sidebar/Sidebar'
import Navbar from '../../../components/navBar/Navbar'
import SearchIcon from '../../../components/icons/SearchIcon'
import { Link, useParams } from 'react-router-dom'
import * as XLSX from 'xlsx';

const NewReception = () => {
  const { purchase_order } = useParams()

  // All products data
  const [allReceptions, setAllReceptions] = useState([
    {
      fecha: '2025-01-01',
      barcode: '01-123456789012',
      codigo:"102500100",
      producto: 'Pollo entero',
      udm: 'libras',
      formato: 'variable',
    },
  ])

  useEffect(() => {
    // Here you would typically fetch the reception details using the purchase_order
    // For now we'll just log it
    // TODO: Fetch reception details based on purchase_order
  }, [purchase_order])

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
      reception.barcode.toLowerCase().includes(searchLower) ||
      reception.codigo.toLowerCase().includes(searchLower)
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const wsData = filteredReceptions.map(reception => [reception.fecha, reception.barcode, reception.codigo, reception.producto, reception.udm, reception.formato]);
    const ws = XLSX.utils.aoa_to_sheet([["Fecha", "Barcode", "Codigo", "Producto", "UDM", "Formato"], ...wsData]);
    XLSX.utils.book_append_sheet(wb, ws, "Receptions");
    XLSX.writeFile(wb, "Receptions.xlsx");
  }

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
              <div className="Exportar">
                <button className="" onClick={handleExport}>
                  <span>Exportar</span>
                </button>

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
                    {paginatedReceptions.map((reception, index) => (
                      <tr key={index}>
                        <td>{reception.fecha}</td>  
                        <td>{reception.barcode}</td>
                        <td>{reception.codigo}</td>
                        <td>{reception.producto}</td>
                        <td>{reception.udm}</td>
                        <td>{reception.formato}</td>
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

export default NewReception

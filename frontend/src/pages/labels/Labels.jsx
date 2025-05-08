import React, { useState, useEffect } from 'react'
import './labels.css'
import Layout from '../../components/Layout'
import SearchIcon from '../../components/icons/SearchIcon'
import CloseContenedorIcon from '../../components/icons/closeContenedor_icon'
import PrintingIcon from '../../components/icons/printing_icon'
import EyesIcon from '../../components/icons/eyes'
import GenericTable from '../../utils/genericTable/GenericTable'
import labelService from '../../services/api/labelService'

const Labels = () => {
  // State declarations
  const [labelsData, setLabelsData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const columnTitles = ["Fecha", "Barcode", "Codigo", "Producto", "UDM", "Formato"];

  useEffect(() => {
    async function fetchLabels() {
      try {
        const response = await labelService.getAll();
        setLabelsData(response);
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    }

    fetchLabels();
  }, []);

  const allLabels = labelsData.map(label => ({
    Fecha: new Date(label.created_at).toLocaleDateString(),
    Barcode: label.barcode,
    Codigo: label.code,
    Producto: label.product_name,
    UDM: label.udm,
    Formato: label.format
  }));

  // Filter products based on search query and date
  const filteredLabels = allLabels.filter(label => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      labelsData.find(l => l.code === label.Codigo)?.product_name?.toLowerCase().includes(searchLower) ||
      labelsData.find(l => l.code === label.Codigo)?.code?.toLowerCase().includes(searchLower)
    const matchesDate = selectedDate ? new Date(labelsData.find(l => l.created_at)).toLocaleDateString() === selectedDate : true
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
    <Layout>
          <div className='products-container flex flex-col gap-4'>
            <div className='products-header flex justify-between items-center'>
              <h4>Etiquetas</h4>
          
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
                <GenericTable
                  elements={paginatedLabels}
                  columnTitles={columnTitles}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  handleReceptionClick={() => {}}
                />
              </div>
            </div>
          </div>
    </Layout>
  )
}

export default Labels

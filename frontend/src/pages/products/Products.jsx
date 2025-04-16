import React, { useState } from 'react'
import './products.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'
import api from '../../services/api'

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
  const [allProducts, setAllProducts] = useState([]);

  // Load products from local storage
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setAllProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Save products to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(allProducts));
  }, [allProducts]);

  // All products data
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Filter products based on search query and date
  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      product.product_name?.toLowerCase().includes(searchLower) ||
      product.code?.toLowerCase().includes(searchLower)
    const matchesDate = selectedDate ? product.created_at?.includes(selectedDate) : true
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

  const handleNewProduct = () => {
    setNewProduct({ codigo: '', producto: '', udm: '', formato: '', proveedor: '', fecha: '' });
  };

  const handleInputChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleSave = () => {
    if (newProduct.codigo && newProduct.producto && newProduct.udm && newProduct.formato) {
      setAllProducts([newProduct, ...allProducts]);
      setNewProduct(null);
    }
  };

  const handleCancel = () => {
    setNewProduct(null);
  };

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
                    {newProduct && (
                      <tr>
                        <td><input type="text" value={newProduct.codigo} onChange={(e) => handleInputChange(e, 'codigo')} /></td>
                        <td><input type="text" value={newProduct.producto} onChange={(e) => handleInputChange(e, 'producto')} /></td>
                        <td><input type="text" value={newProduct.udm} onChange={(e) => handleInputChange(e, 'udm')} /></td>
                        <td><input type="text" value={newProduct.formato} onChange={(e) => handleInputChange(e, 'formato')} /></td>
                        <td><input type="text" value={newProduct.proveedor} onChange={(e) => handleInputChange(e, 'proveedor')} /></td>
                        <td><input type="date" value={newProduct.fecha} onChange={(e) => handleInputChange(e, 'fecha')} /></td>
                        <td>
                          {newProduct.codigo && newProduct.producto && newProduct.udm && newProduct.formato ? (
                            <button onClick={handleSave}>Save</button>
                          ) : (
                            <button onClick={handleCancel}>Cancel</button>
                          )}
                        </td>
                      </tr>
                    )}
                    {paginatedProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.codigo}</td>
                        <td>{product.producto}</td>
                        <td>{product.udm}</td>
                        <td>{product.format}</td>
                        <td>{product.supplier}</td>
                        <td>{new Date(product.created_at).toLocaleDateString()}</td>
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
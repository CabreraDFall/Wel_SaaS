import React, { useState, useEffect } from 'react'
import './products.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'
import { productService } from '../../services/api/productService'
import { httpService } from '../../services/api/httpService'

const Products = () => {
  // State declarations
  const [allProducts, setAllProducts] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setAllProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch UOM options
  const fetchUomOptions = async () => {
    try {
      const data = await httpService.get('/uom_master');
      setUomOptions(data);
    } catch (err) {
      console.error("Error fetching UOM options:", err);
    }
  };

  // Load products and UOM options on component mount
  const fetchSupplierOptions = async () => {
    try {
      const data = await httpService.get('/suppliers');
      setSupplierOptions(data);
    } catch (err) {
      console.error("Error fetching supplier options:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUomOptions();
    fetchSupplierOptions();
  }, []);

  // All products data
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const [newProduct, setNewProduct] = useState(null)

  // Filter products based on search query and date
  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      product.product_name.toLowerCase().includes(searchLower) ||
      product.code.toLowerCase().includes(searchLower)
    const matchesDate = selectedDate ? new Date(product.created_at).toISOString().split('T')[0] === selectedDate : true
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

  const handleNewProduct = () => {
    setNewProduct({ code: '', product_name: '', udm: '', format: '', supplier: '', supplier_id: '' });
  };

  const handleInputChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleSave = async () => {
    // Validar que todos los campos requeridos estén presentes y no vacíos
    const requiredFields = ['code', 'product_name', 'format', 'supplier_id'];
    const missingFields = requiredFields.filter(field => !newProduct[field]?.trim());

    if (missingFields.length > 0) {
      setError(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const productToCreate = {
        ...newProduct,
        supplier_id: newProduct.supplier_id
      };
      const savedProduct = await productService.create(productToCreate);
      setAllProducts([savedProduct, ...allProducts]);
      setNewProduct(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      setAllProducts(allProducts.filter(product => product.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setNewProduct(null);
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className='wrapper'>
        <Sidebar />        
        <div className='container'>
          <Navbar />
          <div className='products-container flex flex-col gap-4'>
            <div className='products-header flex justify-between items-center'>
              <h4>Productos</h4>
              <button onClick={handleNewProduct}>Nuevo productos</button>
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newProduct && (
                      <tr>
                        <td><input type="text" value={newProduct.code} onChange={(e) => handleInputChange(e, 'code')} placeholder="Código" /></td>
                        <td><input type="text" value={newProduct.product_name} onChange={(e) => handleInputChange(e, 'product_name')} placeholder="Nombre del producto" /></td>
                        <td>
                          <select value={newProduct.udm} onChange={(e) => handleInputChange(e, 'udm')}>
                            <option value="">Seleccionar UDM...</option>
                            {uomOptions.map(uom => (
                              <option key={uom.id} value={uom.id}>{uom.name} ({uom.code})</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select value={newProduct.format} onChange={(e) => handleInputChange(e, 'format')}>
                            <option value="">Seleccionar formato...</option>
                            <option value="fijo">Fijo</option>
                            <option value="variable">Variable</option>
                          </select>
                        </td>
                        <td>
                          <select value={newProduct.supplier_id} onChange={(e) => handleInputChange(e, 'supplier_id')}>
                            <option value="">Seleccionar proveedor...</option>
                            {supplierOptions.map(supplier => (
                              <option key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option>
                            ))}
                          </select>
                        </td>
                        <td>-</td>
                        <td>
                          {newProduct.code?.trim() && newProduct.product_name?.trim() && newProduct.format?.trim() && newProduct.supplier_id?.trim() && (
                            <button
                              onClick={handleSave}
                              className="save-btn"
                            >
                              Guardar
                            </button>
                          )}
                          <button onClick={handleCancel} className="cancel-btn">Cancelar</button>
                        </td>
                      </tr>
                    )}
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.code}</td>
                        <td>{product.product_name}</td>
                        <td>{product.udm_name || product.udm || 'N/A'}</td>
                        <td>{product.format}</td>
                        <td>{product.supplier_name || 'N/A'}</td>
                        <td>{new Date(product.created_at).toLocaleDateString()}</td>
                        <td>
                          <button onClick={() => handleDelete(product.id)} className="delete-btn">
                            Eliminar
                          </button>
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

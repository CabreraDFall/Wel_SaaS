import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import './NewLabel.css'
import EmptyPackage from '../../../components/icons/empty_package'
import SearchIcon from '../../../components/icons/SearchIcon'
import { productService } from '../../../services/api/productService'
import GenerateLabels from '../services/generateLabels'

const NewLabel = () => {
  const { purchase_order } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);


  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.product_name.toLowerCase().includes(searchLower) ||
      product.code.toLowerCase().includes(searchLower)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setFilteredProducts([]);
  };

  if (loading) {
    return (
      <Layout>
        <div className='new-label-container'>
          <h4>Etiqueta {purchase_order && `- Orden de compra: ${purchase_order}`}</h4>
          <div className='empty-package-container flex flex-col items-center justify-center'>
            <p>Cargando productos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className='new-label-container'>
          <h4>Etiqueta {purchase_order && `- Orden de compra: ${purchase_order}`}</h4>
          <div className='empty-package-container flex flex-col items-center justify-center'>
            <p className="error-message">Error: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='new-label-container'>
        <div className='flex flex justify-between items-center'>
          <div>
            <h4>Etiqueta </h4>
            <h6>{purchase_order && `Orden de compra: ${purchase_order}`}</h6>

          </div>

        </div>
        {selectedProduct ? (
          <div className="selected-product-container">
            <GenerateLabels
              productName={selectedProduct.product_name}
              productCode={selectedProduct.code}
              udm={selectedProduct.udm_name}
              format={selectedProduct.format}
              productId={selectedProduct.id}
              purchase_order={purchase_order}
            />
          </div>
        ) : (
          <div className='empty-package-container flex flex-col items-center justify-center'>
            <EmptyPackage />
            <div className='search-section'>
              <div className='search-container'>
                <div className="search-box">
                  <div className="search-icon">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar producto"
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                {filteredProducts.length > 0 && (
                  <div className="search-results">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="search-result-item"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="product-name">{product.product_name}{product.udm && <span className="udm">{product.udm}</span>}</div>
                        <div className="product-code">{product.code}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewLabel;

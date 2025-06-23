import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopMenu from '../../../components/topmenu/TopMenu';
import "./newlabel.css"
function NewLabel({ purchase_order }) {
    const [products, setProducts] = useState([]); // State to store products
    const [selectedProduct, setSelectedProduct] = useState(''); // State to store selected product
    const [warehouses, setWarehouses] = useState([]); // State to store warehouses
    const [selectedWarehouse, setSelectedWarehouse] = useState(''); // State to store selected warehouse

    useEffect(() => {
        // Fetch labels from the backend and log the number of results
        const fetchLabels = async (productCount) => {
            console.log("productCount:", productCount);
            console.log("selectedProduct:", selectedProduct);
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await fetch(`http://localhost:3000/api/labels?product_id=${selectedProduct}&count=${productCount}`, { // Replace with your actual API endpoint
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add bearer token to the header
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Number of labels:', data.length);
            } catch (error) {
                console.error("Could not fetch labels:", error);
            }
        };

        const countSelectedProduct = () => {
            if (!selectedProduct) {
                console.log("selectedProduct is null");
                return 0;
            }
            console.log("selectedProduct:", selectedProduct);
            return products.filter(product => product.id === selectedProduct).length;
        };

        const productCount = countSelectedProduct();
        fetchLabels(productCount);

        // Fetch products from the backend
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await fetch('http://localhost:3000/api/products', { // Replace with your actual API endpoint
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add bearer token to the header
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                // Count the number of products with format === 'variable'
                const variableProductsCount = data.filter(product => product.format === 'variable').length;
                console.log('Number of products with format "variable":', variableProductsCount + 1);
            } catch (error) {
                console.error("Could not fetch products:", error);
            }
        };

        fetchProducts();

        // Fetch warehouses from the backend
        const fetchWarehouses = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await fetch('http://localhost:3000/api/warehouses', { // Replace with your actual API endpoint
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add bearer token to the header
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setWarehouses(data);
            } catch (error) {
                console.error("Could not fetch warehouses:", error);
            }
        };

        fetchWarehouses();
    }, [selectedProduct]);

    // Function to handle product selection
    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    // Function to handle warehouse selection
    const handleWarehouseChange = (event) => {
        setSelectedWarehouse(event.target.value);
    };

    return (
        <div className='new-label'>
            <TopMenu title={"Etiqueta"} />
            <div className="new-label__content">
                <div className="new-label__card">
                    <div className="card__header">
                        <h5>Nueva etiqueta</h5>
                    </div>
                    <div className="card__body">
                        <div className="form-group">
                            <label htmlFor="producto">Producto</label>
                            <select
                                className="form-control"
                                id="producto"
                                value={selectedProduct}
                                onChange={handleProductChange}
                            >
                                <option value="">Seleccionar producto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.product_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="almacen">Almacén</label>
                            <select
                                className="form-control"
                                id="almacen"
                                value={selectedWarehouse}
                                onChange={handleWarehouseChange}
                            >
                                <option value="">Seleccionar almacén</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.warehouse_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cantidad">Cantidad</label>
                            <input type="text" className="form-control" id="cantidad" placeholder="0.00 kg" />
                        </div>
                    </div>
                    <div className="card__footer">
                        <button className="btn btn-primary" onClick={handleCreateLabel}>Crear</button>
                        <a className="">Cancelar</a>
                    </div>
                </div>
            </div>
        </div>
    );

    async function handleCreateLabel() {
        // Gather data from the form
        const cantidad = document.getElementById('cantidad').value;

        // Validate data
        if (!selectedProduct || !selectedWarehouse || !cantidad) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const userId = '4f314e72-ebd0-4a2c-bb40-86cc8d54a58f';
            //const userId = localStorage.getItem('userId');
            //if (!userId) {
            //    alert('Por favor, inicie sesión para crear una etiqueta.');
            //    return;
            //}

            // Make API call to generate barcode
            const token = localStorage.getItem('token');
            const generateResponse = await fetch('http://localhost:3000/api/labels/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: selectedProduct,
                    warehouse_id: selectedWarehouse,
                    quantity: cantidad,
                    created_by: userId,
                    warehouseNumber: warehouses.find(w => w.id === selectedWarehouse)?.warehouse_number,
                    productCode: products.find(p => p.id === selectedProduct)?.code,
                    format: products.find(p => p.id === selectedProduct)?.format,
                    purchase_order: purchase_order,
                }),
            });

            if (!generateResponse.ok) {
                throw new Error(`HTTP error! status: ${generateResponse.status}`);
            }

            const generateData = await generateResponse.json();
            alert('Etiqueta creada con éxito!');
            // Optionally, redirect to the labels page or clear the form
        } catch (error) {
            console.error("Could not create label:", error);
            alert('Error al crear la etiqueta. Por favor, inténtelo de nuevo.');
        }
    }
}

export default NewLabel;

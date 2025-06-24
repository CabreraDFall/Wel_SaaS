import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopMenu from '../../../components/topmenu/TopMenu';
import "./newlabel.css";
import ProductSelect from './components/ProductSelect';
import WarehouseSelect from './components/WarehouseSelect';
import QuantityInput from './components/QuantityInput';
import useFetchLabels from './hooks/useFetchLabels';

function NewLabel({ purchase_order, setIsAuthenticated }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const [labels] = useFetchLabels(selectedProduct);

    useEffect(() => {
        console.log("Number of labels:", labels?.length);
    }, [labels]);

    //const labels = useFetchLabels(selectedProduct);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        setIsAuthenticated(false);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Could not fetch products:", error);
            }
        };

        fetchProducts();

        const fetchWarehouses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/warehouses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        setIsAuthenticated(false);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setWarehouses(data);
            } catch (error) {
                console.error("Could not fetch warehouses:", error);
            }
        };

        fetchWarehouses();
    }, []);

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const handleWarehouseChange = (event) => {
        setSelectedWarehouse(event.target.value);
    };

    const handleCreateLabel = async () => {
        const cantidad = document.getElementById('cantidad').value;

        if (!selectedProduct || !selectedWarehouse || !cantidad) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const userId = '4f314e72-ebd0-4a2c-bb40-86cc8d54a58f';
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
                    labelCount: labels?.length,
                }),
            });

            if (!generateResponse.ok) {
                throw new Error(`HTTP error! status: ${generateResponse.status}`);
            }

            const generateData = await generateResponse.json();
            alert('Etiqueta creada con éxito!');
        } catch (error) {
            console.error("Could not create label:", error);
            alert('Error al crear la etiqueta. Por favor, inténtelo de nuevo.');
        }
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
                        <ProductSelect
                            products={products}
                            selectedProduct={selectedProduct}
                            handleProductChange={handleProductChange}
                        />
                        <WarehouseSelect
                            warehouses={warehouses}
                            selectedWarehouse={selectedWarehouse}
                            handleWarehouseChange={handleWarehouseChange}
                        />
                        <QuantityInput />
                    </div>
                    <div className="card__footer">
                        <button className="btn btn-primary" onClick={handleCreateLabel}>Crear</button>
                        <a className="">Cancelar</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewLabel;

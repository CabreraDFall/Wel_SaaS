import React, { useState, useEffect } from 'react';
import TableFilter from '../../components/TableFilter/TableFilter';
import { format } from 'date-fns';
import Pagination from '../../components/Pagination/Pagination';
import Title from "../../components/title//Title";
import { UserIcon } from '../../assets/icons';
import "./products.css";
import TopMenu from '../../components/topmenu/TopMenu';
import ActionMenu from '../../components/ActionMenu/ActionMenu';

function Products({ setIsAuthenticated }) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // You can adjust this
    const [totalItems, setTotalItems] = useState(0);
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:3000/api/products', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        if (response.status === 403) {
                            setIsAuthenticated(false);
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Products data:", data); // Add this line
                    let filteredProducts = data;
                    if (filterValue) {
                        filteredProducts = data.filter(product =>
                            product.product_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                            product.code.toLowerCase().includes(filterValue.toLowerCase())
                        );
                    }
                    setProducts(filteredProducts);
                    setTotalItems(filteredProducts.length);
                } catch (error) {
                    console.error('Error fetching products:', error);
                    // Consider setting an error state here to display an error message to the user
                }
            }
        };

        fetchProducts();
    }, [filterValue]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='header'>
            <TopMenu title={"Productos"} />
            <div className="products__content">
                <div className="table">
                    <div className='table__header'>
                        <div className="table__header-filter">
                            <TableFilter
                                placeholder="Filtrar elementos"
                                value={filterValue}
                                onChange={handleFilterChange}
                            />

                        </div>
                        <button className="table__header-add" onClick={() => { window.location.href = '/products/new'; }}>
                            <span>Agregar</span>
                        </button>
                    </div>
                    <div className='table__body'>
                        <table>
                            <thead>
                                <tr>
                                    <th className='checkInput'><input type="checkbox" className="checkbox" /> Codigo</th>
                                    <th>Nombre</th>
                                    <th>Unidad</th>
                                    <th>Formato</th>
                                    <th>Peso</th>
                                    <th>Proveedor</th>
                                    <th>Fecha</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((product) => (
                                    <tr key={product.id}>
                                        <td className='checkInput'><input type="checkbox" className="checkbox" />{product.code}</td>
                                        <td>{product.product_name}</td>
                                        <td>{product.uom_master.name}</td>
                                        <td>{product.format}</td>
                                        <td>{product.weight}</td>
                                        <td>{product.suppliers.supplier_name}</td>
                                        <td>{format(new Date(product.created_at), 'dd/MM/yyyy')}</td>
                                        <td><ActionMenu /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={paginate}
                    />
                </div>
            </div>
        </div>
    );
}

export default Products;

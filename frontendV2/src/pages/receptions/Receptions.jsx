import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from "../../components/title//Title";
import TableFilter from '../../components/TableFilter/TableFilter';
import { UserIcon } from '../../assets/icons';
import "./receptions.css";
import TopMenu from '../../components/topmenu/TopMenu';
import ActionMenu from '../../components/ActionMenu/ActionMenu';
import Pagination from '../../components/Pagination/Pagination';

function Receptions({ setIsAuthenticated }) {
    const [receptionsData, setReceptionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Puedes permitir que el usuario lo cambie

    useEffect(() => {
        const fetchReceptions = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
                const response = await fetch('http://localhost:3000/api/receptions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        setIsAuthenticated(false);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setReceptionsData(data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchReceptions();
    }, [setIsAuthenticated]);

    const filteredReceptions = receptionsData.filter(reception => {
        const searchLower = searchQuery.toLowerCase();
        return (
            reception.vehicle.toLowerCase().includes(searchLower) ||
            reception.purchase_order.toLowerCase().includes(searchLower)
        );
    });

    // Calculate the items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReceptions.slice(indexOfFirstItem, indexOfLastItem);

    // Function to change the page
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div>Cargando recepciones...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='receptions'>
            <TopMenu title={"Recepciones"} />
            <div className="receptions__content">
                <div className="table">
                    <div className='table__header'>
                        <div className="table__header-filter">
                            <TableFilter
                                placeholder="Buscar por vehículo o orden de compra"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link to={`/recepciones/new`}>
                            <button className="table__header-add">
                                <span>Agregar</span>
                            </button>
                        </Link>
                    </div>
                    <div className='table__body'>
                        <table>
                            <thead>
                                <tr>
                                    <th className='checkInput'><input type="checkbox" className="checkbox" /> Codigo</th>
                                    <th>Vehiculo</th>
                                    <th>Items</th>
                                    <th>Fecha</th>
                                    <th>Estatus</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((reception, index) => (
                                    <tr key={index}>
                                        <td className='checkInput'>
                                            <input type="checkbox" className="checkbox" />
                                            <Link to={`/recepciones/${reception.purchase_order}`}>
                                                {reception.purchase_order}
                                            </Link>
                                        </td>
                                        <td>{reception.vehicle}</td>
                                        <td>{reception.items}</td>
                                        <td>{reception.reception_date}</td>
                                        <td>{reception.status}</td>
                                        <td><ActionMenu /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        totalItems={filteredReceptions.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div >
    );
}

export default Receptions

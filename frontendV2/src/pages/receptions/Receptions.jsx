import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from "../../components/title//Title";
import { UserIcon } from '../../assets/icons';
import "./receptions.css";
import TopMenu from '../../components/topmenu/TopMenu';

function Receptions({ setIsAuthenticated }) {
    const [receptionsData, setReceptionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
                            <input
                                type="text"
                                placeholder="Buscar por vehículo o orden de compra"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button>calendario</button>
                        </div>
                        <button className="table__header-add">
                            <span>Agregar</span>
                        </button>
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
                                {filteredReceptions.map((reception, index) => (
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
                                        <td>...</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="table__footer">
                        <div>
                            <span>{"<"}</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>{">"}</span>
                            <span>todos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Receptions

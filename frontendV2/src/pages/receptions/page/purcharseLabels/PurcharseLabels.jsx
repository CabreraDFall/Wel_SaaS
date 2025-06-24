import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../../../components/title/Title';
import Pagination from '../../../../components/Pagination/Pagination';
import './PurcharseLabels.css';
import TopMenu from '../../../../components/topmenu/TopMenu';
import { Link } from 'react-router-dom';

function PurcharseLabels() {
    const { id } = useParams();
    const [labelsData, setLabelsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // You can adjust this
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setTotalItems(labelsData.length);
    }, [labelsData]);

    console.log("id en PurcharseLabels:", id);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/labels?purchase_order=${id}&page=${currentPage}&limit=${itemsPerPage}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                console.log("API Response:", data);
                setLabelsData(data);
                // setTotalItems(data.total); // Removing this as the API doesn't seem to return total
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        };

        fetchLabels();
    }, [id, currentPage, itemsPerPage]);

    return (
        <div className="purcharse-labels">
            <TopMenu title={`Recepcion: ${id}`} />
            <div className="purcharse-labels__content">
                <div className="table">
                    <div className='table__header'>
                        <div className="table__header-filter">
                            <input type="text" placeholder="Filtrar elementos" />
                            <button>calendario</button>
                        </div>
                        <div className='table-header__btn'>
                            <Link to={`/recepciones/${id}/new`}>
                                <button className="blue-button">Nuevo etiqueta</button>
                            </Link>
                            <Link to={`/labels/print/${id}`}>
                                <button className="blue-button">Imprimir</button>
                            </Link>
                            <button className="blue-button">Export excel</button>
                        </div>
                    </div>
                    <div className="table__body">
                        <table className="labels-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Barcode</th>
                                    <th>Código</th>
                                    <th>Producto</th>
                                    <th>Peso</th>
                                    <th>UDM</th>
                                    <th>Formato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(labelsData) && labelsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((label, index) => (
                                    <tr key={index}>
                                        <td>{new Date(label.created_at).toLocaleDateString()}</td>
                                        <td>{label.barcode}</td>
                                        <td>{label.product_code}</td>
                                        <td>{label.product_name}</td>
                                        <td>{label.quantity}</td>
                                        <td>{label.udm}</td>
                                        <td>{label.format}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PurcharseLabels

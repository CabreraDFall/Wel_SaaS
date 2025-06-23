import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../../../components/title/Title';
import './PurcharseLabels.css';
import TopMenu from '../../../../components/topmenu/TopMenu';
import { Link } from 'react-router-dom';

function PurcharseLabels() {
    const { id } = useParams();
    const [labelsData, setLabelsData] = useState([]);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/labels?purchase_order=${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                setLabelsData(data);
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        };

        fetchLabels();
    }, [id]);

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
                            <button className="blue-button">Imprimir</button>
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
                                    <th>UDM</th>
                                    <th>Formato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(labelsData) && labelsData.map((label, index) => (
                                    <tr key={index}>
                                        <td>{new Date(label.created_at).toLocaleDateString()}</td>
                                        <td>{label.barcode}</td>
                                        <td>{label.product_code}</td>
                                        <td>{label.product_name}</td>
                                        <td>{label.udm}</td>
                                        <td>{label.format}</td>
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

export default PurcharseLabels

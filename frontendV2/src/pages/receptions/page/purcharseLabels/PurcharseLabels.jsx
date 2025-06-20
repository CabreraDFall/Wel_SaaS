import React from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../../../components/title/Title';
import './PurcharseLabels.css'; // Import the CSS file
import TopMenu from '../../../../components/topmenu/TopMenu';
import { Link } from 'react-router-dom';

function PurcharseLabels() {
    const { id } = useParams();

    const labelsData = [
        { fecha: '2024-07-01', barcode: '1234567890', codigo: 'PROD-001', producto: 'Product 1', udm: 'kg', formato: 'Box' },
        { fecha: '2024-07-02', barcode: '0987654321', codigo: 'PROD-002', producto: 'Product 2', udm: 'm', formato: 'Roll' },
    ];

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
                                {labelsData.map((label, index) => (
                                    <tr key={index}>
                                        <td>{label.fecha}</td>
                                        <td>{label.barcode}</td>
                                        <td>{label.codigo}</td>
                                        <td>{label.producto}</td>
                                        <td>{label.udm}</td>
                                        <td>{label.formato}</td>
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

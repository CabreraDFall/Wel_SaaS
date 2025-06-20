import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Title from "../../components/title//Title";
import { UserIcon } from '../../assets/icons';
import "./receptions.css";

import TopMenu from '../../components/topmenu/TopMenu';


function Receptions() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // Datos de ejemplo para las recepciones
    const receptionsData = [
        {
            ordenCompra: "OC001",
            vehiculo: "Vehiculo A",
            items: "Alas de pollo",
            fecha: "10/05/2025",
            estatus: "Recibido"
        },
        {
            ordenCompra: "OC002",
            vehiculo: "Vehiculo B",
            items: "Pescado fresco",
            fecha: "11/05/2025",
            estatus: "En tránsito"
        },
        {
            ordenCompra: "OC003",
            vehiculo: "Vehiculo C",
            items: "Carne de res",
            fecha: "12/05/2025",
            estatus: "Procesando"
        }
    ];

    return (
        <div className='receptions'>
            <TopMenu title={"Recepciones"} />
            <div className="receptions__content">
                <div className="table">
                    <div className='table__header'>
                        <div className="table__header-filter">
                            <input type="text" placeholder="Filtrar elementos" />
                            <button>calendario</button>
                        </div>
                        <button className="table__header-add" onClick={togglePanel}>
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
                                {receptionsData.map((reception, index) => (
                                    <tr key={index}>
                                        <td className='checkInput'>
                                            <input type="checkbox" className="checkbox" />
                                            <Link to={`/recepciones/${reception.ordenCompra}`}>
                                                {reception.ordenCompra}
                                            </Link>
                                        </td>
                                        <td>{reception.vehiculo}</td>
                                        <td>{reception.items}</td>
                                        <td>{reception.fecha}</td>
                                        <td>{reception.estatus}</td>
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

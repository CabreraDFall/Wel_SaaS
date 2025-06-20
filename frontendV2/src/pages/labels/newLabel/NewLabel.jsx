import React from 'react';
import { Link } from 'react-router-dom';
import TopMenu from '../../../components/topmenu/TopMenu';
import "./newlabel.css"
function NewLabel() {
    // Array de productos
    const productos = [
        { codigo: "PROD00001", nombre: "Producto 1" },
        { codigo: "PROD00002", nombre: "Producto 2" },
        { codigo: "PROD00003", nombre: "Producto 3" }
    ];

    return (
        <div className='new-label'>


            <TopMenu title={"Nueva etiqueta"} />

            <div className="new-label__content">
                <div className="table">
                    <div className="table__header">
                        <div className="table__header-filter">
                            <input type="text" placeholder="Filtrar elementos" />

                        </div>
                    </div>
                    <div className="table__body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Codigo</th>
                                    <th>Producto</th>

                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto, index) => {
                                    return (
                                        <tr key={index} className="table-row-link">
                                            <td className="table-cell">
                                                <Link to={`${producto.codigo}`}>
                                                    {producto.codigo}
                                                </Link>
                                            </td>
                                            <td className="table-cell">
                                                <Link to={`${producto.codigo}`}>
                                                    {producto.nombre}
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div >
    );
}

export default NewLabel;

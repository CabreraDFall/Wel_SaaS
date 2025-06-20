import React, { useState } from 'react';
import Title from "../../components/title//Title";
import { UserIcon } from '../../assets/icons';
import "./products.css";
import AddProductPanel from './components/add/AddProductPanel';
import TopMenu from '../../components/topmenu/TopMenu';

function Products() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className='header'>
            <TopMenu title={"Productos"} />
            <div className="products__content">
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
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Alas de pollo</td>
                                    <td>kg</td>
                                    <td>fijo</td>
                                    <td>10.05</td>
                                    <td>Miguel A.</td>
                                    <td>05/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Pescado fresco</td>
                                    <td>kg</td>
                                    <td>variable</td>
                                    <td>0.00</td>
                                    <td>Laura S.</td>
                                    <td>06/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Carne de res</td>
                                    <td>kg</td>
                                    <td>fijo</td>
                                    <td>15.75</td>
                                    <td>Carlos M.</td>
                                    <td>07/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Frutas mixtas</td>
                                    <td>kg</td>
                                    <td>variable</td>
                                    <td>0.00</td>
                                    <td>Ana G.</td>
                                    <td>08/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Verduras ...</td>
                                    <td>kg</td>
                                    <td>fijo</td>
                                    <td>5.20</td>
                                    <td>Jorge T.</td>
                                    <td>09/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Queso parmes ...</td>
                                    <td>kg</td>
                                    <td>variable</td>
                                    <td>0.00</td>
                                    <td>Sofía L.</td>
                                    <td>10/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Aceite de oliva</td>
                                    <td>L</td>
                                    <td>fijo</td>
                                    <td>6.75</td>
                                    <td>Luis R.</td>
                                    <td>11/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Arroz integral</td>
                                    <td>kg</td>
                                    <td>variable</td>
                                    <td>0.00</td>
                                    <td>Claudia P.</td>
                                    <td>12/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Lentejas</td>
                                    <td>kg</td>
                                    <td>fijo</td>
                                    <td>4.50</td>
                                    <td>Ricardo H.</td>
                                    <td>13/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Pan integral</td>
                                    <td>kg</td>
                                    <td>variable</td>
                                    <td>0.00</td>
                                    <td>Elena F.</td>
                                    <td>14/09/2025</td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td className='checkInput'><input type="checkbox" className="checkbox" />PODOOO001</td>
                                    <td>Leche entera</td>
                                    <td>L</td>
                                    <td>fijo</td>
                                    <td>1.25</td>
                                    <td>Fernando Q.</td>
                                    <td>15/09/2025</td>
                                    <td>...</td>
                                </tr>
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
            <AddProductPanel isOpen={isPanelOpen} onClose={togglePanel} />
        </div>
    );
}

export default Products;

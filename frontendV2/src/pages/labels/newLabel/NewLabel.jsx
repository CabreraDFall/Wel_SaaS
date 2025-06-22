import React from 'react';
import { Link } from 'react-router-dom';
import TopMenu from '../../../components/topmenu/TopMenu';
import "./newlabel.css"
function NewLabel() {

    return (
        <div className='new-label'>


            <TopMenu title={"Etiqueta"} />

            <div className="new-label__content">
                <div className="new-label__card">
                    <div className="card__header">
                        <h5>Nueva etiqueta</h5>
                    </div>
                    <div className="card__body">
                        <div className="form-group">
                            <label htmlFor="producto">Producto</label>
                            <input type="text" className="form-control" id="producto" placeholder="Buscar producto" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="almacen">Almacen</label>
                            <input type="text" className="form-control" id="almacen" placeholder="Buscar producto" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cantidad">Cantidad</label>
                            <input type="text" className="form-control" id="cantidad" placeholder="0.00 kg" />
                        </div>
                    </div>
                    <div className="card__footer">
                        <button className="btn btn-primary">Crear</button>
                        <a className="">Cancelar</a>
                    </div>
                </div>
            </div>
        </div>



    );
}

export default NewLabel;

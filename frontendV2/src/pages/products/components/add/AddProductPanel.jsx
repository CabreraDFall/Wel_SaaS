import React from 'react';
import './AddProductPanel.css';
import InputText from "../../../../components/InputText/InputText"

function AddProductPanel({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="add-product-panel">
                <div className="add-product-panel__header">
                    <h5>Agregar Producto</h5>
                    <button onClick={onClose}>Cerrar</button>
                </div>
                <div className="add-product-panel__content">
                    <form>
                        <div className="form-group">
                            <InputText placeholder="Codigo" />
                        </div>
                        <div className="form-group">
                            <InputText placeholder="Nombre" />
                        </div>
                        <div className="form-group">
                            <InputText placeholder="Unidad" />
                        </div>
                        <div className="form-group">
                            <InputText placeholder="Formato" />
                        </div>
                        <div className="form-group">
                            <InputText placeholder="Peso" />
                        </div>
                        <div className="form-group">
                            <InputText placeholder="Proveedor" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha">Fecha:</label>
                            <input type="date" id="fecha" name="fecha" />
                        </div>
                        <button type="submit">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProductPanel;

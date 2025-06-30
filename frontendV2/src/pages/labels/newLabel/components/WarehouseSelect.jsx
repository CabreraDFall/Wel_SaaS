import React from 'react';

function WarehouseSelect({ warehouses, selectedWarehouse, handleWarehouseChange }) {
    return (
        <div className="form__group">
            <select
                className="form__selected"
                id="almacen"
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
            >
                <option value="">Seleccionar almacén</option>
                {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.warehouse_name}
                    </option>
                ))}
                <label htmlFor="almacen" className='form__label'>Almacén</label>
            </select>
        </div>
    );
}

export default WarehouseSelect;

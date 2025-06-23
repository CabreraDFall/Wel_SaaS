import React from 'react';

function WarehouseSelect({ warehouses, selectedWarehouse, handleWarehouseChange }) {
    return (
        <div className="form-group">
            <label htmlFor="almacen">Almacén</label>
            <select
                className="form-control"
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
            </select>
        </div>
    );
}

export default WarehouseSelect;

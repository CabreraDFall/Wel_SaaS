import React from 'react';

function QuantityInput() {
    return (
        <div className="form-group">
            <label htmlFor="cantidad">Cantidad</label>
            <input type="text" className="form-control" id="cantidad" placeholder="0.00 kg" />
        </div>
    );
}

export default QuantityInput;

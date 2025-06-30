import React from 'react';

function QuantityInput() {
    return (
        <div className="form__group">
            <input type="text" className="form-control form__input" id="cantidad" placeholder="" />
            <label htmlFor="cantidad" className='form__label'>Cantidad</label>
        </div>
    );
}

export default QuantityInput;

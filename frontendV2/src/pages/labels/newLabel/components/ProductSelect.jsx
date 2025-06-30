import React from 'react';

function ProductSelect({ products, selectedProduct, handleProductChange }) {
    return (
        <div className="form__group">
            <select
                className="form-control form__selected"
                id="producto"
                value={selectedProduct}
                onChange={handleProductChange}
            >
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.product_name}
                    </option>
                ))}
            </select>
            <label htmlFor="producto">Producto</label>
        </div>
    );
}

export default ProductSelect;

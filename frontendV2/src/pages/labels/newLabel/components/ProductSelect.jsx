import React from 'react';

function ProductSelect({ products, selectedProduct, handleProductChange }) {
    return (
        <div className="form-group">
            <label htmlFor="producto">Producto</label>
            <select
                className="form-control"
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
        </div>
    );
}

export default ProductSelect;

import React from 'react';
import Barcode from './Barcode';

const LabelsToPrint = ({ labels }) => {
    return (
        <div>
            {labels.map((label) => (
                <div key={label.id}>
                    <h1>{label.productName}</h1>
                    <img src="URL_DE_LA_IMAGEN" alt="Product Image" />
                    <Barcode value={label.barcode} />
                    <p>PO: {label.purchase_order}</p>
                    <p>Product ID: {label.productId}</p>
                </div>
            ))}
        </div>
    );
};

export default LabelsToPrint;

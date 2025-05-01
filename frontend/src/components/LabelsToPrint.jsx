import React from 'react';
import Barcode from './Barcode';

const LabelsToPrint = ({ labels }) => {
    return (
        <div>
            {labels.map((label) => (
                <div key={label.barcode}>
                    <h1>{label.producto}</h1>
                    <img src="URL_DE_LA_IMAGEN" alt="Product Image" />
                    <Barcode value={label.barcode} />
                    <p>Codigo: {label.codigo}</p>
                    <p>UDM: {label.udm}</p>
                    <p>Formato: {label.formato}</p>
                </div>
            ))}
        </div>
    );
};

export default LabelsToPrint;

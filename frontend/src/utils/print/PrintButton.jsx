import React from 'react';

const PrintButton = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button onClick={handlePrint}>
            Imprimir
        </button>
    );
};

export default PrintButton;

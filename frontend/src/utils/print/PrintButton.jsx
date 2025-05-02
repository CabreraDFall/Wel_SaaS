import React from 'react';

const PrintButton = ({ onClick }) => {
  const handlePrint = () => {
    onClick();
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <button onClick={handlePrint}>
      Imprimir
    </button>
  );
};

export default PrintButton;

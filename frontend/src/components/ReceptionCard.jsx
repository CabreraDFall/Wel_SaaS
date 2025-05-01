import React from 'react';

const ReceptionCard = ({ reception, pageSize }) => {
  const cardStyle = {
    width: pageSize.width,
    height: pageSize.height,
    border: '1px solid black',
    padding: '2px',
    margin: '2px',
    pageBreakAfter: 'always',
    boxSizing: 'border-box',
    fontSize: '0.7em',
  };

  return (
    <div style={cardStyle}>
      <p>Fecha: {reception.fecha}</p>
      <p>Barcode: {reception.barcode}</p>
      <p>Codigo: {reception.codigo}</p>
      <p>Producto: {reception.producto}</p>
      <p>UDM: {reception.udm}</p>
      <p>Formato: {reception.formato}</p>
    </div>
  );
};

export default ReceptionCard;

import React, { useRef, useEffect } from 'react';

const ReceptionCard = ({ reception, pageSize }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.width = pageSize.width;
      cardRef.current.style.height = pageSize.height;
      cardRef.current.style.border = '1px solid black';
      cardRef.current.style.padding = '5px';
      cardRef.current.style.margin = '5px';
      cardRef.current.style.pageBreakAfter = 'always';
      cardRef.current.style.boxSizing = 'border-box';
    }
  }, [reception, pageSize]);

  return (
    <div ref={cardRef} style={{width: '100px', height: '200px'}}>
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

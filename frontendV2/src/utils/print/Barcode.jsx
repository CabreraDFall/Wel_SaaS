import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, value, {
                format: 'CODE128',
                displayValue: true,
                fontSize: 20,
            });
        }
    }, [value]);

    return (
        <svg ref={svgRef} />
    );
};

export default Barcode;

import React, { useState, useRef } from 'react';
import './PrintLabels.css';

const PrintLabels = ({ labels }) => {
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();
  const labelsToPrint = labels.filter(label => label.active && !label.is_printed);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const printWindow = window.open('', '');
      if (printWindow) {
        let labelContent = '';
        labelsToPrint.forEach(label => {
          labelContent += `
            <div class="label-page">
              <h1>${label.productName}</h1>
              <p>Barcode: ${label.barcode}</p>
              <p>PO: ${label.purchase_order}</p>
              <p>Product ID: ${label.productId}</p>
            </div>
          `;
        });

        printWindow.document.write(`
          <html>
            <head>
              <title>Print Labels</title>
              <style>
                @page {
                  size: 315px 212px;
                  margin: 0;
                }
                body {
                  margin: 0;
                }
                .label-page {
                  width: 315px;
                  height: 212px;
                  border: 1px solid black;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
              </style>
            </head>
            <body>
              ${labelContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } else {
        alert('Please allow pop-ups for printing.');
      }
    } catch (error) {
      console.error('Error printing labels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePrint} disabled={loading}>
        {loading ? 'Generating Labels...' : 'Print Labels'}
      </button>
    </div>
  );
};

const MemoizedPrintLabels = React.memo(PrintLabels);

export default MemoizedPrintLabels;

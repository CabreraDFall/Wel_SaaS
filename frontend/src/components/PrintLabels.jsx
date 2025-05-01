import React, { useState, useRef } from 'react';
import './PrintLabels.css';
import LabelsToPrint from './LabelsToPrint'; // Status: Se importó el componente LabelsToPrint

const PrintLabels = ({ labels, onLabelsPrinted }) => { // Status: Se agregó la prop onLabelsPrinted
  const [loading, setLoading] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const componentRef = useRef();
  // Assuming labels is an array of reception objects
  // We don't need to filter based on active and is_printed
  // const labelsToPrint = labels.filter(label => label.active && !label.is_printed);
  const labelsToPrint = labels;

  const handlePrint = async () => {
    setLoading(true);
    setShowLabels(true);
    try {
      setTimeout(() => {
        const printContent = componentRef.current;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        setLoading(false);
        setShowLabels(false);

        if (onLabelsPrinted) {
          onLabelsPrinted(labelsToPrint);
        }
      }, 500);
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
      <div ref={componentRef}>
        {showLabels && <LabelsToPrint labels={labelsToPrint} />}
      </div>
    </div>
  );
};

const MemoizedPrintLabels = React.memo(PrintLabels);

export default MemoizedPrintLabels;

import React, { useState, useRef } from 'react';
import './PrintLabels.css';
import LabelsToPrint from './LabelsToPrint'; // Status: Se importó el componente LabelsToPrint

const PrintLabels = ({ labels, onLabelsPrinted }) => { // Status: Se agregó la prop onLabelsPrinted
  const [loading, setLoading] = useState(false);
  const [showLabels, setShowLabels] = useState(false); // Status: Se agregó el estado para mostrar las etiquetas
  const componentRef = useRef();
  const labelsToPrint = labels.filter(label => label.active && !label.is_printed);

  const handlePrint = async () => {
    setLoading(true);
    setShowLabels(true); // Status: Se establece el estado para mostrar las etiquetas
    try {
      setTimeout(() => {
        const printContent = componentRef.current;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        setLoading(false);
        setShowLabels(false);

        if (onLabelsPrinted) { // Status: Se verifica si onLabelsPrinted existe
          onLabelsPrinted(labelsToPrint); // Status: Se llama a onLabelsPrinted con las etiquetas impresas
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
      <div ref={componentRef}> {/* Status: Se agregó la referencia al componente */}
        {showLabels && <LabelsToPrint labels={labelsToPrint} />} {/* Status: Se agregó el componente LabelsToPrint condicionalmente */}
      </div>
    </div>
  );
};

const MemoizedPrintLabels = React.memo(PrintLabels);

export default MemoizedPrintLabels;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import PrintButton from '../../utils/print/PrintButton';
import labelService from '../../services/api/labelService';
import LabelCard from '../../utils/print/labelCard';


const PrintReception = () => {
  const { purchase_order } = useParams();
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await labelService.getLabelsByPurchaseOrder(purchase_order);
        setLabels(response || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [purchase_order]);

  if (loading) {
    return <div>Cargando etiquetas...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <Layout>
      <div className='new-label-container'>
        <div className='flex flex justify-between items-center'>
          <div>
            <h4>{`Imprimir: ${purchase_order}`}</h4>

          </div>
          <PrintButton onClick={() => { }} />
        </div>
        <div className="labels-container">
          {labels.map(label => (
            <LabelCard
              key={label.id}
              companyName="Mi Compania"
              productName={label.product_name}
              weight={label.weight}
              udmCode={label.uom_code}
              barcode={label.barcode}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PrintReception;

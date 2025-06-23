import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './newReception.css';
import Layout from '../../../components/Layout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import labelService from '../../../services/api/labelService';
import GenericTable from '../../../utils/GenericTable/GenericTable';
import PrintButton from '../../../utils/print/PrintButton';
import LabelCard from '../../../utils/print/labelCard';

function NewReception() {
  const { purchase_order } = useParams();
  const navigate = useNavigate();
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const handleExportExcel = () => {
    const excludedKeys = ['id', 'product_id', 'warehouse_id', 'active', 'created_by', 'created_at', 'updated_at', 'deleted_at', 'is_printed'];
    const filteredLabels = labels.map(label => {
      const filteredLabel = {};
      Object.keys(label).forEach(key => {
        if (!excludedKeys.includes(key)) {
          filteredLabel[key] = label[key];
        }
      });
      return filteredLabel;
    });
    const csv = Papa.unparse(filteredLabels);
    const blob = new Blob([csv]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'etiquetas.csv';
    a.click();
  };

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

  const totalPages = Math.ceil(labels.length / itemsPerPage);
  const paginatedLabels = labels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Cargando etiquetas...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <Layout>
      <div className='reception-container flex flex-col gap-4'>
        <div className='reception-header flex justify-between items-center'>
          <h4>Etiquetas</h4>
          <div>
            <Link className='reception-header-button' to={`/labels/${purchase_order}`}>Nuevo etiqueta</Link>
            <PrintButton onClick={() => navigate(`/reception/${purchase_order}/print`)} />
            <button onClick={handleExportExcel}>Export excel</button>
          </div>
        </div>
        <div className='products-body'>

          <div className='products-table'>
            <GenericTable
              columnTitles={["Fecha", "Barcode", "Codigo", "Producto", "UDM", "Formato"]}
              elements={paginatedLabels.map(label => ({
                Fecha: new Date(label.created_at).toLocaleDateString(),
                Barcode: label.barcode,
                Codigo: label.product_code,
                Producto: label.product_name,
                UDM: label.uom_code,
                Formato: label.format
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NewReception;

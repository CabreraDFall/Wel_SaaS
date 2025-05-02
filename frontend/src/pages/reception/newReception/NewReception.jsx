import React, { useState, useEffect } from 'react';
import './newReception.css';
import Sidebar from '../../../components/sidebar/Sidebar';
import Navbar from '../../../components/navBar/Navbar';
import { Link, useParams } from 'react-router-dom';
import labelService from '../../../services/api/labelService';
import GenericTable from '../../../utils/genericTable/GenericTable';
import PrintButton from '../../../utils/print/PrintButton';
import LabelCard from '../../../utils/print/labelCard';

function NewReception() {
  const { purchase_order } = useParams();
  const [labels, setLabels] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handlePrint = () => {
    setIsPrinting(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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
    <div className='wrapper'>
      <Sidebar />
      <div className='container'>
        <Navbar />
        <div className='reception-container flex flex-col gap-4'>
          <div className='reception-header flex justify-between items-center'>
            <h4>Etiquetas</h4>
            <>
            <Link className='reception-header-button' to={`/labels/${purchase_order}`}>Nuevo etiqueta</Link>
            <PrintButton onClick={handlePrint} />
            </>
          </div>
          <div className='products-body'>
            {isPrinting ? (
              <div className='labels-container'>
                {paginatedLabels.map(label => (
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
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewReception;

import React from 'react';

const PaginationTable = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="pagination-container flex justify-between items-center">
      <div className="pagination-info">
        Página {currentPage} - {totalPages}
      </div>
      <div className="pagination-controls flex gap-4">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PaginationTable;

import React from 'react';
import PaginationTable from '../genericTable/pagination/PaginationTable';

const GenericTable = ({ elements, columnTitles, currentPage, totalPages, handlePageChange }) => {
  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            {columnTitles.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((element, index) => (
            <tr key={index}>
              {Object.values(element).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationTable
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default GenericTable;

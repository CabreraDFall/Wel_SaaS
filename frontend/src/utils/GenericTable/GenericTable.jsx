import React from 'react';
import Dropdown from '../genericTable/inputsTypes/Dropdown';
import PaginationTable from '../genericTable/pagination/PaginationTable';

const GenericTable = ({ elements, columnTitles, currentPage, totalPages, handlePageChange, newFormInputs, handleInputChange, handleSave, handleCancel }) => {
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
          {newFormInputs && (
            <tr>
              {newFormInputs.map((input, index) => (
                <td key={index}>
                  {input.type === 'dropdown' ? (
                    <select onChange={(e) => handleInputChange(e, input.name)}>
                      <Dropdown endpoint={input.endpoint} displayValue={input.displayValue } />
                    </select>
                  ) : (
                    <input
                      type={input.type}
                      value={input.value}
                      onChange={(e) => handleInputChange(e, input.name)}
                    />
                  )}
                </td>
              ))}
              <td></td>
              <td>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={handleCancel}>Cancelar</button>
              </td>
            </tr>
          )}
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

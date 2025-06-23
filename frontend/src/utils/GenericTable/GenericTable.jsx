import React, { useState } from 'react';
import './genericTable.css';
import Dropdown from '../GenericTable/inputsTypes/Dropdown';
import PaginationTable from '../genericTable/pagination/PaginationTable';

const GenericTable = ({ elements, columnTitles, currentPage, totalPages, handlePageChange, newFormInputs, handleInputChange, handleSave, handleCancel, handleReceptionClick, rowClickDestination, rowStyle }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <>
      <div className='tableWeb'>
        <table className="w-full reception-table">
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
                      <Dropdown
                        endpoint={input.endpoint}
                        displayValue={input.displayValue}
                        onChange={(e) => input.onChange(e, input.name)}
                        value={input.value}
                      />
                    ) : input.type === 'select' ? (
                      <select value={input.value} onChange={(e) => input.onChange(e, input.name)}>
                        <option value="">Seleccione una opción</option>
                        {input.options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        value={input.value}
                        onChange={(e) => input.onChange(e, input.name)}
                        readOnly={input.readOnly}
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button onClick={handleSave}>Guardar</button>
                  <button onClick={handleCancel}>Cancelar</button>
                </td>
              </tr>
            )}
            {elements.map((element, index) => (
              <tr key={index} style={rowStyle && rowStyle(element)} {...(handleReceptionClick ? { onClick: () => handleReceptionClick(rowClickDestination(element)) } : {})}>
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
      <div className='tableMobile'>
        {elements.map((element, index) => (
          <div key={index} className="accordion">
            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
              {Object.values(element)[0]}
            </div>
            <div className={`accordion-content ${activeAccordion === index ? 'active' : ''}`}>
              {Object.entries(element).map(([key, value]) => (
                <div key={key} className="card-item">
                  <span className="card-key">{key}:</span>
                  <span className="card-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GenericTable;

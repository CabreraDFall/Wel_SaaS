import React from 'react';

const GenericTable = ({ elements, columnTitles }) => {
  return (
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
  );
};

export default GenericTable;

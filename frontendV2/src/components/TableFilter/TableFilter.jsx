import React from 'react';
import './TableFilter.css'; // Create this file for styling

function TableFilter({ placeholder, value, onChange }) {
    return (
        <div className="table__header-filter">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default TableFilter;

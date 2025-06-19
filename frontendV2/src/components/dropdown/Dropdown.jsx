import React from 'react';
import "./dropdown.css";

function Dropdown({ DropdownName, items, isCollapsed }) {
    return (
        <div className={`dropdown ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='dropdown__header'>
                <span>{DropdownName}</span>
            </div>
            <div className='dropdown__content'>
                <ul>
                    {items.map((item, index) => (
                        <li key={index} className={index === 0 ? 'active' : ''}>
                            {item.icon && <item.icon />}
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dropdown;

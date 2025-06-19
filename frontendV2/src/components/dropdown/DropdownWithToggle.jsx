import React, { useState } from 'react';
import "./dropdown.css";
import DropdownToggle from './DropdownToggle'; // Import the new component

function DropdownWithToggle({ DropdownName, items, isCollapsed }) {
    const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Function to toggle the dropdown
    };

    return (
        <div className={`dropdown ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='dropdown__header' onClick={toggleDropdown}> {/* Add onClick handler */}
                <span>{DropdownName}</span>
                <DropdownToggle isOpen={isOpen} /> {/* Use the new component */}
            </div>
            {isOpen && ( // Conditionally render the dropdown content
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
            )}
        </div>
    );
}

export default DropdownWithToggle;

import React from 'react';
import { ChevronDownIcon } from '../../assets/icons';

function DropdownToggle({ isOpen }) {
    return (
        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(270deg)', transition: 'transform 0.3s ease' }}>
            <ChevronDownIcon />
        </div>
    );
}

export default DropdownToggle;

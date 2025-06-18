import React from 'react';

const LeftChevron = ({ height = 24, width = 24, color = "#E8E6F1", onClick }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <path d="M11 17L6 12L11 7M18 17L13 12L18 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default LeftChevron;

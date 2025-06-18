import React from 'react';

const ProductIcon = ({ width = 20, height = 20, color = "white", onClick }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <path d="M5 11.25H8.75V12.5H5V11.25ZM5 13.75H11.25V15H5V13.75Z" fill={color} />
            <path d="M16.25 2.5H3.75C3.41863 2.5005 3.10098 2.63235 2.86666 2.86666C2.63235 3.10098 2.5005 3.41863 2.5 3.75V16.25C2.5005 16.5814 2.63235 16.899 2.86666 17.1333C3.10098 17.3676 3.41863 17.4995 3.75 17.5H16.25C16.5814 17.4995 16.899 17.3676 17.1333 17.1333C17.3676 16.899 17.4995 16.5814 17.5 16.25V3.75C17.4995 3.41863 17.3676 3.10098 17.1333 2.86666C16.899 2.63235 16.5814 2.5005 16.25 2.5ZM11.25 3.75V6.25H8.75V3.75H11.25ZM3.75 16.25V3.75H7.5V7.5H12.5V3.75H16.25L16.2506 16.25H3.75Z" fill={color} />
        </svg>
    );
};

export default ProductIcon;

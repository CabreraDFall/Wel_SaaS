import React from 'react';
import Logo from '../../components/logo/Logo';
import './LayoutOffline.css'; // Importa el archivo CSS

function LayoutOffline({ children }) {
    return (
        <div className="layout-offline">
            <div className="layout-offline__logo"><Logo /></div>
            <div className="layout-offline__content">{children}</div>
        </div>
    );
}

export default LayoutOffline;

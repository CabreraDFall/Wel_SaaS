import React, { useState, useRef, useEffect } from 'react';
import './ActionMenu.css';
import { DotsIcon } from '../../assets/icons';


function ActionMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="action-menu-container">
            <button className="action-button" onClick={toggleMenu}>
                <DotsIcon />
            </button>
            {showMenu && (
                <div className="action-menu" ref={menuRef}>
                    <button className="action-menu-item">Ver</button>
                    <button className="action-menu-item">Actualizar</button>
                    <button className="action-menu-item">Deshabilitar</button>
                </div>
            )}
        </div>
    );
}

export default ActionMenu;

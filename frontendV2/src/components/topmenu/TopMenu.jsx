import React from 'react'
import { ChevronDownIcon, UserIcon } from '../../assets/icons'
import "./topmenu.css"
import { useLocation } from 'react-router-dom';

function TopMenu({ title }) {
    const location = useLocation();
    const goBack = () => {
        window.history.back();
    };

    const showBackButton = location.pathname !== '/';

    return (
        <div className="header__content">
            <div className='header__content-left'>
                {showBackButton && (
                    <span className='left__icon' onClick={goBack} style={{ cursor: 'pointer' }}>
                        <ChevronDownIcon />
                    </span>
                )}
                <h4>{title}</h4>
            </div>
            <UserIcon />
        </div>
    )
}

export default TopMenu

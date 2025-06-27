import React, { useState, useEffect } from 'react'
import "./layoutOnline.css"
import Logo from "../../components/logo/Logo"
import { LeftChevron, DeliveryIcon, ProductIcon, LabelsIcon } from '../../assets/icons';
import Dropdown from '../../components/dropdown/Dropdown'
import DropdownWithToggle from '../../components/dropdown/DropdownWithToggle' // Import DropdownWithToggle

const mainMenu = [
    {
        icon: DeliveryIcon,
        label: "Recepción",
        url: "/recepciones"
    }, {
        icon: ProductIcon,
        label: "Productos",
        url: "/productos"
    },
    {
        icon: LabelsIcon,
        label: "Etiquetas",
        url: "/etiquetas"
    }
];


function LayoutOnline({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 780);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 780);
            setIsCollapsed(window.innerWidth < 780);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="layout-online">
            <div className={`layout-online__sidebar ${isCollapsed ? 'collapsed' : ''} `}>
                <div className='logoWrapper'>
                    <Logo />
                    <LeftChevron onClick={toggleSidebar} style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', cursor: 'pointer' }} />
                </div>
                <Dropdown DropdownName="menu" items={mainMenu} isCollapsed={isCollapsed} />
                <DropdownWithToggle DropdownName="Configuracion" items={mainMenu} isCollapsed={isCollapsed} />
            </div>
            <div className="layout-online__content">
                {children}
            </div>
        </div>
    )
}

export default LayoutOnline

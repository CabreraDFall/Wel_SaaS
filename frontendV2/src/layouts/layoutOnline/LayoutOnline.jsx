import React from 'react'
import "./layoutOnline.css"
import Logo from "../../components/logo/Logo"
import { LeftChevron, DeliveryIcon, ProductIcon, LabelsIcon } from '../../assets/icons';
import Dropdown from '../../components/dropdown/Dropdown'
import DropdownWithToggle from '../../components/dropdown/DropdownWithToggle' // Import DropdownWithToggle

const mainMenu = [
    {
        icon: DeliveryIcon,
        label: "Recepción"
    }, {
        icon: ProductIcon,
        label: "Productos"
    },
    {
        icon: LabelsIcon,
        label: "Etiquetas"
    }
];


function LayoutOnline({ children }) {
    return (
        <div className="layout-online">
            <div className="layout-online__sidebar">
                <div className='logoWrapper'>
                    <Logo />
                    <LeftChevron />
                </div>
                <Dropdown DropdownName="menu" items={mainMenu} />
                <DropdownWithToggle DropdownName="Configuracion" items={mainMenu} /> {/* Use DropdownWithToggle */}
            </div>
            <div className="layout-online__content">
                {children}
            </div>
        </div>
    )
}

export default LayoutOnline

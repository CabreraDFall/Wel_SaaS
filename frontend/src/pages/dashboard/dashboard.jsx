import './dashboard.css'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navBar/Navbar'
import React, { useRef } from 'react'; // Status: Se importó useRef
import LabelCard from '../../utils/print/labelCard';

const Dashboard = () => {
    const componentRef = useRef(); // Status: Se creó una referencia al componente
    const handlePrint = () => { // Status: Se agregó la función para imprimir
        const printContent = componentRef.current;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
    };

    return (
        <div className='wrapper'>
            <Sidebar />
            <div className='container'>
                <Navbar />
                <div className='dashboard-container'>
                    <h1>Dashboard</h1>

                    <LabelCard companyName={"Shellfish del Caribe"} productName={"Costillas de Pollo"} weight={"21.5"} udmCode={"lbs"} barcode={"01-123456789012"} />
                    
                </div>
            </div>
        </div>
    )
}

export default Dashboard

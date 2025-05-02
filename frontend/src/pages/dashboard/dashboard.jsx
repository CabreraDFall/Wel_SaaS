import './dashboard.css'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navBar/Navbar'
import React from 'react'; // Status: Se importó useRef
import LabelCard from '../../utils/print/labelCard';

const Dashboard = () => {
  

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

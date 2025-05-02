import './dashboard.css'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navBar/Navbar'
import React from 'react'; // Status: Se importó useRef



const Dashboard = () => {
    return (
        <div className='wrapper'>
            <Sidebar />
            <div className='container'>
                <Navbar />
                <div className='dashboard-container'>
                    <h1>Dashboard</h1>

                    
                </div>
            </div>
        </div>
    )
}

export default Dashboard

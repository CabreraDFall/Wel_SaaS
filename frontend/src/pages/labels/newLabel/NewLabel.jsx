import React from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Navbar from '../../../components/navBar/Navbar'  
import './newLabel.css'
import EmptyPackage from '../../../components/icons/empty_package'

const NewLabel = () => {
  return (
    <div className='wrapper'>
        <Sidebar />
        <div className='container'>
            <Navbar />
            <div className='new-label-container'>
                <h4>Etiqueta</h4>
                <div className='empty-package-container flex flex-col items-center justify-center'>
                    <EmptyPackage />
                    <p>No hay paquetes para etiquetar</p>
                </div>
            </div>
        </div>
    </div>
  )
}   

export default NewLabel
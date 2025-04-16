import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../../components/sidebar/Sidebar'
import Navbar from '../../../components/navBar/Navbar'  
import './newLabel.css'
import EmptyPackage from '../../../components/icons/empty_package'

const NewLabel = () => {
  const { purchase_order } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (purchase_order) {
      // Here you would typically fetch the reception details using the purchase_order
      console.log('Purchase Order:', purchase_order);
      // TODO: Fetch reception details based on purchase_order
    }
  }, [purchase_order]);

  return (
    <div className='wrapper'>
        <Sidebar />
        <div className='container'>
            <Navbar />
            <div className='new-label-container'>
                <h4>Etiqueta {purchase_order && `- Orden de compra: ${purchase_order}`}</h4>
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
import React from 'react'
import './products.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'

const Products = () => {
  return (
    <div className='wrapper'>
        <Sidebar />        
        <div className='container'>
          <Navbar />
          <div className='products-container flex flex-col gap-4'>
            <div className='products-header flex justify-between items-center'>
              <h1>Productos</h1>
              <button>Nuevo productos</button>
            </div>
            <div className='products-body'>
              <div className='products-table'>
                <table>
                  
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Products
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import UomCategories from './UomCategories';
import UomMaster from './UomMaster';
import Warehouses from './Warehouses';
import Suppliers from './Suppliers';
import "./settings.css"

function Settings() {
  const [activeTab, setActiveTab] = useState('uomCategories');

  return (
    <Layout>
        <div className="dashboard-container">
          <h1>Configuración</h1>
          <div className="tabs">
          <button
              className={activeTab === 'suppliers' ? 'active' : ''}
              onClick={() => setActiveTab('suppliers')}
            >
              Proveedores
            </button>
            <button
              className={activeTab === 'warehouses' ? 'active' : ''}
              onClick={() => setActiveTab('warehouses')}
            >
              Almacenes
            </button>
          
            <button
              className={activeTab === 'uomCategories' ? 'active' : ''}
              onClick={() => setActiveTab('uomCategories')}
            >
              Categorías de UOM
            </button>
            <button
              className={activeTab === 'uomMaster' ? 'active' : ''}
              onClick={() => setActiveTab('uomMaster')}
            >
              UOM Master
            </button>
          
          </div>

          <div className="tab-content">
            {activeTab === 'suppliers' && <Suppliers />}
            {activeTab === 'uomCategories' && <UomCategories />}
            {activeTab === 'warehouses' && <Warehouses />}
            {activeTab === 'uomMaster' && <UomMaster />}
          </div>
        </div>
    </Layout>
  );
}

export default Settings;

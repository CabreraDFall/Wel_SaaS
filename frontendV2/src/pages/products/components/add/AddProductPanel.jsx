import React, { useState, useEffect } from 'react';
import './AddProductPanel.css';
import TopMenu from '../../../../components/topmenu/TopMenu';

function AddProductPanel() {
    // State variables for form inputs
    const [uoms, setUoms] = useState([]);
    const [formato, setFormato] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [uom, setUom] = useState('');
    const [peso, setPeso] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [fecha, setFecha] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission



        const token = localStorage.getItem('token');

        // Find the selected UOM and Supplier IDs
        const selectedUom = uoms.find(item => item.name === uom);
        const selectedSupplier = suppliers.find(item => item.supplier_name === proveedor);

        // Collect form data with backend keys
        const formData = {
            code: codigo,
            product_name: nombre,
            uom_id: selectedUom ? selectedUom.id : null, // Use null if UOM not found
            // udm: selectedUom ? selectedUom.udm : null, // Assuming udm is part of UOM data, uncomment if needed
            format: formato,
            weight: peso,
            supplier_id: selectedSupplier ? selectedSupplier.id : null, // Use null if Supplier not found
            date: fecha,
        };

        console.log("Submitting form data:", formData);

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Product added successfully!');
                // Optionally, close the modal or reset the form

            } else {
                console.error('Failed to add product:', response.status, await response.text());
                // Handle error (e.g., display an error message)
            }
        } catch (error) {
            console.error('Error adding product:', error);
            // Handle error (e.g., display an error message)
        }
    };

    useEffect(() => {
        const fetchUoms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/uom_master', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUoms(data);
            } catch (error) {
                console.error('Error fetching UOMs:', error);
                // Handle error (e.g., set an error state)
            }
        };

        const fetchSuppliers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/suppliers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                // Handle error (e.g., set an error state)
            }
        };

        fetchUoms();
        fetchSuppliers();
    }, []);

    // Effect to set peso to 0 when formato is variable
    useEffect(() => {
        if (formato === 'variable') {
            setPeso('0');
        }
    }, [formato]);

    return (
        <div>
            <TopMenu title={"Producto"} />
            <div className="add-product-panel__header">
                Nuevo producto
            </div>
            <div className="add-product-panel__content">
                <form onSubmit={handleSubmit} className="form">

                    <div className="form__group">
                        <input
                            type="text"
                            id="codigo"
                            className="form__input"
                            placeholder=" "
                            pattern="[0-9]{8}"
                            title="El código debe tener 8 dígitos"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                        <label htmlFor="codigo" className="form__label">Código</label>
                    </div>

                    <div className="form__group">
                        <input
                            type="text"
                            id="nombre"
                            className="form__input"
                            placeholder=" "
                            pattern="[a-zA-Z\s]+"
                            title="El nombre debe contener solo texto"
                            maxLength="50"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <label htmlFor="nombre" className="form__label">Nombre</label>
                    </div>
                    <div className="form__group-selected">
                        <select className="form__selected" id='uom' value={uom} onChange={(e) => setUom(e.target.value)}>
                            <option className="form_seleted-option" value="">Elige una opcion</option>
                            {uoms.map(uom => (
                                <option key={uom.id} value={uom.name}>{uom.name}</option>
                            ))}
                        </select>
                        <label htmlFor="uom" className="form__label">UOM</label>
                    </div>

                    <div className="form__group-selected">
                        <div className="form-group">
                            <select
                                className="form__selected" id='formato'
                                onChange={e => setFormato(e.target.value)}>
                                <option value="">Elige un formato</option>
                                <option value="fijo">Fijo</option>
                                <option value="variable">Variable</option>
                            </select>

                            <label htmlFor="formato" className="form__label">Formato</label>
                        </div>

                    </div>

                </form>
            </div>
        </div>

    );
}

export default AddProductPanel;

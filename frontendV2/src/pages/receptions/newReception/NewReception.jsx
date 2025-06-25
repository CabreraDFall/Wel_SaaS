import React, { useState, useContext, useEffect } from 'react'; // Importar useEffect
import TopMenu from '../../../components/topmenu/TopMenu';
import "./new-reception.css"
import { UserContext } from '../../../UserProvider';


function NewReception() {
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        vehicle: '',
        purchase_order: '',
        items: 0, // Items se inicializa a 0 y no es un campo de formulario
        reception_date: '',
        status: 'descargando', // Inicializar estatus a 'descargando'
        created_by: user[0].id  // Inicializar a null, se actualizará con useEffect
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Validar los campos 'vehicle' y 'purchase_order' para permitir solo mayúsculas y números
        if (name === 'vehicle' || name === 'purchase_order') {
            const upperCaseValue = value.toUpperCase();
            if (/^[A-Z0-9]*$/.test(upperCaseValue)) {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: upperCaseValue
                }));
            }
        } else {
            // Para otros campos, actualizar el estado normalmente
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Los datos a enviar ya incluyen created_by en el estado local (con el id del usuario)
        const dataToSend = formData;

        console.log('Datos a enviar:', dataToSend); // Log para verificar los datos antes de enviar
        console.log('Valor de created_by antes de fetch:', formData.created_by); // Verificar created_by
        try {
            const token = localStorage.getItem('token'); // Obtener el token de autenticación
            const response = await fetch('http://localhost:3000/api/receptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend) // Enviar los datos actualizados
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Recepción creada con éxito:', result);
            // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al crear recepción:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    return (
        <div>
            <TopMenu title={"Nueva Recepción"} />
            <div className="new-reception-form">
                <h2>Crear Nueva Recepción</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="vehicle">Vehículo:</label>
                        <input
                            type="text"
                            id="vehicle"
                            name="vehicle"
                            value={formData.vehicle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="purchase_order">Orden de Compra:</label>
                        <input
                            type="text"
                            id="purchase_order"
                            name="purchase_order"
                            value={formData.purchase_order}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* El campo Items ya no es un input y se inicializa a 0 */}
                    <div>
                        <label htmlFor="reception_date">Fecha de Recepción:</label>
                        <input
                            type="date"
                            id="reception_date"
                            name="reception_date"
                            value={formData.reception_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Estatus:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="descargando">descargando</option>
                            <option value="finalizado">finalizado</option>
                            <option value="en camino">en camino</option>
                        </select>
                    </div>

                    <button type="submit"> {/* Eliminar disabled y texto condicional */}
                        Guardar Recepción
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewReception;

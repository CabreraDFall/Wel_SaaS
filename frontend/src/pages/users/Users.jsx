import React, { useState, useEffect } from 'react';
import './users.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navBar/Navbar';
import SearchIcon from '../../components/icons/SearchIcon';
import { userService } from '../../services/api/userService';
import GenericTable from '../../utils/genericTable/GenericTable';

const Users = () => {
  // State declarations
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query and date
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.employee_number?.toLowerCase().includes(searchLower);
    const matchesDate = selectedDate ? new Date(user.created_at).toLocaleDateString() === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Event handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value);
    setShowDatePicker(false);
    setCurrentPage(1); // Reset to first page when changing date
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewUser = () => {
    setNewUser({ first_name: '', last_name: '', email: '', employee_number: '', role: '', password: '' });
  };

  const handleInputChange = (e, field) => {
    setNewUser(prevUser => ({ ...prevUser, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      const requiredFields = ['first_name', 'last_name', 'email', 'employee_number', 'role', 'password'];
      const missingFields = requiredFields.filter(field => !newUser[field]?.trim());

      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const { first_name, last_name, email, employee_number, role, password } = newUser;
      const savedUser = await userService.createUser({ first_name, last_name, email, employee_number, role, password });
      setUsers([savedUser, ...users]);
      setNewUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setNewUser(null);
  };

  // Column titles for the GenericTable
  const columnTitles = [
    'ID Empleado',
    'Email',
    'Nombre',
    "apellido",
    'Cargo',
    'Fecha de creación',
    'Acciones'
  ];

  // Transform the data to match the GenericTable's expected format
  const tableData = paginatedUsers.map(user => ({
    'ID Empleado': user.employee_number,
    'Email': user.email,
    'Nombre': user.first_name ,
    "apellido": user.last_name,
    'Cargo': user.role,
    'Fecha de creación': new Date(user.created_at).toLocaleDateString(),
    'Acciones': <button className="more-options">•••</button>,
  }));

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className='wrapper'>
      <Sidebar />
      <div className='container'>
        <Navbar />
        <div className='users-container flex flex-col gap-4'>
          <div className='users-header flex justify-between items-center'>
            <h4>Usuarios</h4>
            <button onClick={handleNewUser}>Nuevo usuario</button>
          </div>
          <div className='users-filters flex justify-between items-center'>
            <div className='search-container'>
              <div className="search-wrapper">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar usuario"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="calendar-container">
              <button className="calendar-btn" onClick={toggleDatePicker}>
                <span>{selectedDate || 'Calendario'}</span>
              </button>
              {showDatePicker && (
                <div className="date-picker-dropdown">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateSelect}
                    className="date-input"
                  />
                </div>
              )}
            </div>
          </div>
          <div className='users-body'>
            <div className='users-table'>
              <GenericTable
                elements={tableData}
                columnTitles={columnTitles}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                newForm={newUser}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
                newFormInputs={newUser ? [
                  { name: 'first_name', type: 'text', value: newUser.first_name, onChange: handleInputChange },
                  { name: 'email', type: 'text', value: newUser.email, onChange: handleInputChange },
                  { name: 'employee_number', type: 'text', value: newUser.employee_number, onChange: handleInputChange },
                  { name: 'role', type: 'text', value: newUser.role, onChange: handleInputChange },
                  { name: 'password', type: 'password', value: newUser.password, onChange: handleInputChange },
                ] : null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

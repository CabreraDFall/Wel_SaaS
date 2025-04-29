import React, { useState } from 'react'
import './users.css'
import Sidebar from '../../components/sidebar/Sidebar'  
import Navbar from '../../components/navBar/Navbar'
import SearchIcon from '../../components/icons/SearchIcon'

const Users = () => {
  // All products data
  const allUsers = [
    {
      idEmpleado: 'SC-102500100',
      email: 'juanpastilzal@gmail.com',
      name: 'Juan Pastilzal',
      jobTitle: 'Administrador',
      lastLogin: '2025-01-01',
    },
    {
      idEmpleado: 'SC-102500101',
      email: 'velariecarro@gmail.com',
      name: 'Velarie Carro',
      jobTitle: 'Empleado',
      lastLogin: '2025-01-01',
    },
  ]

  // State declarations
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Filter products based on search query and date
  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    const matchesDate = selectedDate ? user.lastLogin === selectedDate : true
    return matchesSearch && matchesDate
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Event handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value)
    setShowDatePicker(false)
    setCurrentPage(1) // Reset to first page when changing date
  }

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='wrapper'>
        <Sidebar />        
        <div className='container'>
          <Navbar />
          <div className='users-container flex flex-col gap-4'>
            <div className='users-header flex justify-between items-center'>
              <h4>Usuarios</h4>
              <button>Nuevo usuario</button>
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
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>ID Empleado</th>
                      <th>Email</th>
                      <th>Nombre</th>
                      <th>Cargo</th>
                      <th>Último login</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.idEmpleado}</td>
                        <td>{user.email}</td>
                        <td>{user.name}</td>
                        <td>{user.jobTitle}</td>
                        <td>{user.lastLogin}</td>
                        <td>
                          <button className="more-options">•••</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination-container flex justify-between items-center">
                  <div className="pagination-info">
                    Página {currentPage} - {totalPages}
                  </div>
                  <div className="pagination-controls flex gap-4">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Anterior
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Users

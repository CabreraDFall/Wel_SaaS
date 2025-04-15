import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Products from './pages/products/Products'
import Reception from './pages/reception/reception'
import Labels from './pages/labels/Labels'
import Users from './pages/users/Users'
import Dashboard from './pages/dashboard/dashboard'
import NewReception from './pages/reception/newReception/newReception'
import NewLabel from './pages/labels/newLabel/NewLabel'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/reception/new-reception" element={<NewReception />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/labels/new-label" element={<NewLabel />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  )
}

export default App

import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/login/login'
import Home from './pages/home/Home'
import Products from './pages/products/products'
function App() {
  return (
    <>
    

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Perfil from './components/Perfil'
import NavBar from './components/Navbar'
import CrearPublicacion from './components/CrearPublicacion'
import Footer from './components/Footer'


function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path='/crear' element={<CrearPublicacion/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
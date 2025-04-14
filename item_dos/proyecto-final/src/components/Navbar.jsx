import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function NavBar() {
  const [showMenu, setShowMenu] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/perfil">Perfil</Link>}
        {!isAuthenticated && <Link to="/login">Ingresar</Link>}
        {!isAuthenticated && <Link to="/register">Registrar</Link>}
      </div>
      <div className="nav-right">
        {isAuthenticated && (
          <>
            <Link to="/crear" className="boton">Crear Publicacion</Link>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar

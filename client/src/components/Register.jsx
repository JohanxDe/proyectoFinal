import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
  
    setError('')
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol: 'user', // Se cambiara si necesito otro rol
        }),
      })
  
      if (res.ok) {
        const data = await res.json()
        alert('Registro exitoso')
        console.log('Usuario creado:', data)
        
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Error al registrar')
      }
    } catch (err) {
      console.error('Error al registrar:', err)
      setError('Error de red o del servidor')
    }
  }
  

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Repetir Contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  )
}

export default Register

import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiBase}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('storage'))
        navigate('/perfil'); // o la ruta que uses
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error en el login');
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default Login

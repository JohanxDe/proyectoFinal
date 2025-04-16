// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
const apiBase = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

const Home = () => {
  const [publicaciones, setPublicaciones] = useState([]);

  // Simulando datos por ahora
  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const res = await fetch(`${apiBase}/api/publicaciones`);
        const data = await res.json();
        setPublicaciones(data);
      } catch (err) {
        console.error('Error al obtener publicaciones:', err);
      }
    };

    obtenerPublicaciones();
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenido a la Plataforma</h1>
      <p>Explora publicaciones, guarda tus favoritas y gestiona tu perfil.</p>

      <div className="publicaciones-recientes">
        <h2>📢 Publicaciones Recientes</h2>
        <div className="cards-container">
          {publicaciones.map(pub => (
            <div key={pub.id} className="card">
              <img src={pub.imagen_url} alt={pub.titulo} />
              <h3>{pub.titulo}</h3>
              <p>{pub.descripcion}</p>
              <span className="fecha">{pub.created_at}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;


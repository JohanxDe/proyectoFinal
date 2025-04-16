import { useState, useEffect } from 'react';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    // Cargar las publicaciones y los favoritos del usuario
    obtenerMisPublicaciones();
    obtenerFavoritos();
    obtenerPerfil();
  }, []);

  const obtenerPerfil = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/perfil`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setUsuario(data);
    } catch (err) {
      console.error('Error al obtener perfil:', err);
    }
  };

  const obtenerMisPublicaciones = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/publicaciones/mias`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setPublicaciones(data);
    } catch (err) {
      console.error('Error al obtener publicaciones:', err);
    }
  };

  const obtenerFavoritos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favoritos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setFavoritos(data.map(fav => fav.publicacion_id));
    } catch (err) {
      console.error('Error al obtener favoritos:', err);
    }
  };

  const marcarFavorito = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favoritos/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavoritos([...favoritos, id]);  // Agregamos el id al estado de favoritos
      } else {
        alert('Error al marcar como favorito');
      }
    } catch (err) {
      console.error('Error al marcar favorito:', err);
    }
  };

  const desmarcarFavorito = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favoritos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavoritos(favoritos.filter(fav => fav !== id));  // Eliminamos el id del estado de favoritos
      } else {
        alert('Error al desmarcar como favorito');
      }
    } catch (err) {
      console.error('Error al desmarcar favorito:', err);
    }
  };
  const eliminarPublicacion = async (id) => {
    const token = localStorage.getItem('token');
    const confirmar = confirm('¿Estás seguro de que quieres eliminar esta publicación?');
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/publicaciones/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPublicaciones(publicaciones.filter(pub => pub.id !== id));
        setSelected(null); // Limpiamos los detalles si se había seleccionado
      } else {
        alert('Error al eliminar publicación');
      }
    } catch (err) {
      console.error('Error al eliminar publicación:', err);
    }
  }

  return (
    <div className="perfil-container">
      <main>
        <h2>Perfil</h2>
        <p>Nombre: <strong>{usuario?.nombre || 'Cargando...'}</strong></p>

        <div className="contenido">
          <div className="publicaciones">
            <h3>Publicaciones:</h3>
            {publicaciones.length > 0 ? (
              publicaciones.map((pub, idx) => (
                <div key={idx} className="publicacion-item">
                  <p onClick={() => setSelected(pub)}>{pub.titulo}</p>
                  <div className="acciones">
                    {favoritos.includes(pub.id) ? (
                      <button onClick={() => desmarcarFavorito(pub.id)}>Desmarcar como favorito</button>
                    ) : (
                      <button onClick={() => marcarFavorito(pub.id)}>Marcar como favorito</button>
                    )}
                    <button onClick={() => eliminarPublicacion(pub.id)} style={{ marginLeft: '10px', background: 'crimson', color: 'white' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No tienes publicaciones</p>
            )}
          </div>

          <div className="detalles">
            <h3>Detalles:</h3>
            {selected ? (
              <p>Fecha de creación: {new Date(selected.created_at).toLocaleDateString()}</p>
            ) : (
              <p>Selecciona una publicación</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Perfil;

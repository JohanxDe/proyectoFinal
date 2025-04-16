import { useState } from "react";

function CrearPublicacion() {
  const [titulo, setTitulo] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar si el token existe en localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/publicaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          imagen: imagenUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la publicación");
      }

      const data = await response.json();
      console.log("Publicación creada con éxito:", data);

      // Limpiar los campos del formulario después de crear la publicación
      setTitulo("");
      setImagenUrl("");
      setDescripcion("");
      setError(null); // Limpiar cualquier error anterior
      alert("Publicación creada con éxito");
    } catch (err) {
      console.error("Error al crear la publicación:", err);
      setError("Hubo un problema al crear la publicación.");
    }
  };

  return (
    <div className="crear-publicacion">
      <h2>Crear Publicación</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </label>

        <label>
          URL imagen:
          <input
            type="text"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            required
          />
        </label>

        <label>
          Descripción:
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </label>

        <button type="submit">Crear publicación</button>
      </form>
    </div>
  );
}

export default CrearPublicacion;

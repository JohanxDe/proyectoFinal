// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Proyecto Final. Todos los derechos reservados.</p>
      <div className="social-icons">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

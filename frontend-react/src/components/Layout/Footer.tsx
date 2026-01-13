import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <Container className="text-center">
        <p className="mb-0">
          © {new Date().getFullYear()} Sistema de Inventario - Enfermería ESCOM IPN
        </p>
        <small className="text-muted">
          Versión 1.0.0 - Modo Desarrollo
        </small>
      </Container>
    </footer>
  );
};

export default Footer;

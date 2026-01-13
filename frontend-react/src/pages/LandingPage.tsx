import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHospital, FaPills, FaUserNurse, FaChartLine, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">
                <FaHospital className="me-3" />
                Sistema de Inventario
                <span className="highlight">Enfermería ESCOM</span>
              </h1>
              <p className="hero-subtitle">
                Gestión integral de medicamentos, materiales médicos y atención de pacientes 
                para el área de enfermería de la Escuela Superior de Cómputo
              </p>
              <div className="hero-buttons">
                <Link to="/login">
                  <Button variant="primary" size="lg" className="me-3">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline-light" size="lg">
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Sistema de Inventario" 
                  className="img-fluid rounded"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5 section-title">Características Principales</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <FaPills className="feature-icon" />
                  <Card.Title>Gestión de Medicamentos</Card.Title>
                  <Card.Text>
                    Control completo de inventario, caducidades, lotes y stock mínimo
                    de medicamentos.
                  </Card.Text>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Control de caducidades</ListGroup.Item>
                    <ListGroup.Item>Seguimiento de lotes</ListGroup.Item>
                    <ListGroup.Item>Alertas de stock mínimo</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <FaUserNurse className="feature-icon" />
                  <Card.Title>Atención a Pacientes</Card.Title>
                  <Card.Text>
                    Sistema de recetas electrónicas y seguimiento de tratamientos
                    para pacientes.
                  </Card.Text>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Recetas digitales</ListGroup.Item>
                    <ListGroup.Item>Historial médico</ListGroup.Item>
                    <ListGroup.Item>Control de tratamientos</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <FaDatabase className="feature-icon" />
                  <Card.Title>Inventario Inteligente</Card.Title>
                  <Card.Text>
                    Gestión de materiales médicos con reportes automáticos y
                    análisis de consumo.
                  </Card.Text>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Reportes automáticos</ListGroup.Item>
                    <ListGroup.Item>Análisis de consumo</ListGroup.Item>
                    <ListGroup.Item>Órdenes de compra</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 section-title">Beneficios</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="benefit-item text-center">
                <div className="benefit-icon">
                  <FaChartLine />
                </div>
                <h5>Eficiencia Operativa</h5>
                <p>Reducción del 60% en tiempo de gestión de inventario</p>
              </div>
            </Col>
            
            <Col md={6} lg={3}>
              <div className="benefit-item text-center">
                <div className="benefit-icon">
                  <FaShieldAlt />
                </div>
                <h5>Seguridad</h5>
                <p>Control de accesos y auditoría completa de movimientos</p>
              </div>
            </Col>
            
            <Col md={6} lg={3}>
              <div className="benefit-item text-center">
                <div className="benefit-icon">
                  <FaDatabase />
                </div>
                <h5>Precisión</h5>
                <p>99.8% de precisión en el control de existencias</p>
              </div>
            </Col>
            
            <Col md={6} lg={3}>
              <div className="benefit-item text-center">
                <div className="benefit-icon">
                  <FaHospital />
                </div>
                <h5>Atención Mejorada</h5>
                <p>Respuesta más rápida en la atención a pacientes</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Users Section */}
      <section className="users-section py-5">
        <Container>
          <h2 className="text-center mb-5 section-title">Roles del Sistema</h2>
          <Row>
            <Col md={3} className="mb-4">
              <Card className="user-role-card text-center">
                <Card.Body>
                  <Badge bg="primary" className="role-badge">ADMIN</Badge>
                  <Card.Title className="mt-3">Administrador</Card.Title>
                  <Card.Text>
                    Control total del sistema, usuarios, reportes y configuración.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-4">
              <Card className="user-role-card text-center">
                <Card.Body>
                  <Badge bg="success" className="role-badge">ENFERMERO</Badge>
                  <Card.Title className="mt-3">Personal de Enfermería</Card.Title>
                  <Card.Text>
                    Gestión de inventario, atención a pacientes y administración de medicamentos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-4">
              <Card className="user-role-card text-center">
                <Card.Body>
                  <Badge bg="info" className="role-badge">MÉDICO</Badge>
                  <Card.Title className="mt-3">Médico</Card.Title>
                  <Card.Text>
                    Prescripción de medicamentos y revisión de historiales médicos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-4">
              <Card className="user-role-card text-center">
                <Card.Body>
                  <Badge bg="warning" className="role-badge">AUXILIAR</Badge>
                  <Card.Title className="mt-3">Auxiliar</Card.Title>
                  <Card.Text>
                    Apoyo en gestión de inventario y registro básico de movimientos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="mb-4">¿Listo para optimizar tu gestión de inventario?</h2>
          <p className="lead mb-4">
            Únete a la modernización del área de enfermería de ESCOM
          </p>
          <Link to="/login">
            <Button variant="light" size="lg" className="px-5">
              Comenzar Ahora
            </Button>
          </Link>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-section py-4 bg-dark text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h5>ESCOM - IPN</h5>
              <p className="mb-0">
                Escuela Superior de Cómputo<br />
                Instituto Politécnico Nacional
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-0">
                © {new Date().getFullYear()} Sistema de Inventario - Enfermería ESCOM<br />
                <small>Versión 1.0.0 - Desarrollado con React + Spring Boot</small>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;

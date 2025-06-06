import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lightbulb, FileText, BoxArrowRight, Person } from 'react-bootstrap-icons';
import { getCurrentUser, logout } from '../services/authService';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const NAV_CONFIG = {
    BRAND_NAME: 'Lean Startup Assistant',
    ROUTES: {
      HOME: '/',
      LOGIN: '/login',
      REGISTER: '/register'
    }
  };

  const handleLogout = () => {
    logout();
    navigate(NAV_CONFIG.ROUTES.LOGIN);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const renderBrand = () => (
    <Navbar.Brand as={Link} to={NAV_CONFIG.ROUTES.HOME}>
      <Lightbulb className="me-2" size={24} />
      {NAV_CONFIG.BRAND_NAME}
    </Navbar.Brand>
  );

  const renderAuthenticatedNav = () => (
    <>
      <Nav className="me-auto">
        <Nav.Link 
          as={Link} 
          to={NAV_CONFIG.ROUTES.HOME} 
          active={isActiveRoute(NAV_CONFIG.ROUTES.HOME)}
          className="d-flex align-items-center"
        >
          <FileText className="me-2" size={18} />
          Mis Hipótesis
        </Nav.Link>
      </Nav>
      <Nav>
        <div className="d-flex align-items-center text-white me-3">
          <Person className="me-1" size={18} />
          {currentUser.name}
        </div>
        <Button 
          variant="outline-light" 
          className="d-flex align-items-center"
          onClick={handleLogout}
        >
          <BoxArrowRight className="me-2" size={18} />
          Cerrar Sesión
        </Button>
      </Nav>
    </>
  );

  const renderUnauthenticatedNav = () => (
    <Nav className="ms-auto">
      <Nav.Link as={Link} to={NAV_CONFIG.ROUTES.LOGIN} className="text-white">
        Iniciar Sesión
      </Nav.Link>
      <Nav.Link as={Link} to={NAV_CONFIG.ROUTES.REGISTER} className="text-white">
        Registrarse
      </Nav.Link>
    </Nav>
  );

  const renderNavContent = () => currentUser ? renderAuthenticatedNav() : renderUnauthenticatedNav();
  
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        {renderBrand()}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {renderNavContent()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
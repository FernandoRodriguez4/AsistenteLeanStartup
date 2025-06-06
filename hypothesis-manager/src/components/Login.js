import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BoxArrowInRight, 
  ExclamationTriangle, 
  EnvelopeFill, 
  LockFill, 
  EyeFill, 
  EyeSlashFill,
  Lightbulb
} from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();

  const FORM_FIELDS = {
    email: { type: 'email', name: 'email', placeholder: 'nombre@ejemplo.com', icon: <EnvelopeFill className="text-muted" size={16} /> },
    password: { type: 'password', name: 'password', placeholder: 'Ingrese su contraseña', icon: <LockFill className="text-muted" size={16} /> }
  };

  const AUTH_MESSAGES = {
    LOGIN_ERROR_DEFAULT: 'Error al iniciar sesión. Verifique sus credenciales.',
    LOGIN_ERROR_NO_FUNCTION: 'Error: Función de login no disponible'
  };

  useEffect(() => {
    clearError && clearError();
    return () => clearError && clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    
    try {
      if (login) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        setLocalError(AUTH_MESSAGES.LOGIN_ERROR_NO_FUNCTION);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || AUTH_MESSAGES.LOGIN_ERROR_DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  const displayError = authError || localError;

  const renderLogo = () => (
    <div className="text-center mb-4">
      <div className="auth-logo d-inline-block p-3 rounded-circle bg-primary">
        <Lightbulb className="text-white" size={32} />
      </div>
      <h2 className="auth-title mt-3">¡Bienvenido de nuevo!</h2>
      <p className="auth-subtitle text-muted">Inicia sesión para continuar con Lean Startup Assistant</p>
    </div>
  );

  const renderError = () => displayError && (
    <Alert variant="danger" className="d-flex align-items-center mb-4 border-0">
      <ExclamationTriangle className="me-2 flex-shrink-0" size={20} />
      <div>{displayError}</div>
    </Alert>
  );

  const renderInputField = (field, showToggle = false) => (
    <InputGroup>
      <InputGroup.Text className="bg-light border-end-0">{field.icon}</InputGroup.Text>
      <Form.Control
        type={field.name === 'password' && showPassword ? 'text' : field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        placeholder={field.placeholder}
        className={`bg-light border-start-0 ${showToggle ? 'border-end-0' : ''}`}
        required
      />
      {showToggle && (
        <InputGroup.Text 
          className="bg-light border-start-0 cursor-pointer"
          onClick={togglePasswordVisibility}
          style={{ cursor: 'pointer' }}
        >
          {showPassword ? <EyeSlashFill className="text-muted" size={16} /> : <EyeFill className="text-muted" size={16} />}
        </InputGroup.Text>
      )}
    </InputGroup>
  );

  const renderEmailField = () => (
    <Form.Group className="mb-4">
      <Form.Label>Correo Electrónico</Form.Label>
      {renderInputField(FORM_FIELDS.email)}
    </Form.Group>
  );

  const renderPasswordField = () => (
    <Form.Group className="mb-4">
      <div className="d-flex justify-content-between">
        <Form.Label>Contraseña</Form.Label>
        <Link to="/forgot-password" className="text-decoration-none small">¿Olvidaste tu contraseña?</Link>
      </div>
      {renderInputField(FORM_FIELDS.password, true)}
    </Form.Group>
  );

  const renderRememberMe = () => (
    <Form.Group className="mb-4">
      <Form.Check type="checkbox" id="rememberMe" label="Mantener sesión iniciada" className="text-muted" />
    </Form.Group>
  );

  const renderSubmitButton = () => (
    <div className="d-grid gap-2 mb-4">
      <Button variant="primary" type="submit" size="lg" className="py-2" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Iniciando sesión...
          </>
        ) : (
          <>
            <BoxArrowInRight className="me-2" size={18} />
            Iniciar Sesión
          </>
        )}
      </Button>
    </div>
  );

  const renderRegisterLink = () => (
    <div className="text-center">
      <p className="mb-0 text-muted">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="text-decoration-none fw-semibold">Crear cuenta</Link>
      </p>
    </div>
  );

  const renderForm = () => (
    <Form onSubmit={handleLoginSubmit}>
      {renderEmailField()}
      {renderPasswordField()}
      {renderRememberMe()}
      {renderSubmitButton()}
      {renderRegisterLink()}
    </Form>
  );

  const renderFooter = () => (
    <div className="text-center mt-4">
      <p className="text-muted small mb-0">
        © {new Date().getFullYear()} Lean Startup Assistant. Todos los derechos reservados.
      </p>
    </div>
  );

  return (
    <Container className="auth-container">
      <Row className="justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Col md={6} lg={5}>
          {renderLogo()}
          <Card className="shadow border-0 login-card">
            <Card.Body className="p-4 p-md-5">
              {renderError()}
              {renderForm()}
            </Card.Body>
          </Card>
          {renderFooter()}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
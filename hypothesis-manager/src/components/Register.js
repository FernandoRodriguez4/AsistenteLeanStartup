import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Container, InputGroup, ProgressBar } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PersonPlus, 
  Check2Circle, 
  ExclamationTriangle, 
  EnvelopeFill, 
  LockFill, 
  PersonFill, 
  EyeFill, 
  EyeSlashFill,
  Lightbulb,
  CheckCircleFill,
  XCircleFill
} from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  
  // Usar el contexto de autenticación
  const { register, error: authError, clearError } = useAuth();

  // Limpiar errores cuando el componente se monta o desmonta
  useEffect(() => {
    clearError && clearError();
    return () => clearError && clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Calcular la fortaleza de la contraseña
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    // Criterios para medir la fortaleza de la contraseña
    const lengthValid = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calcular la puntuación de fortaleza
    let strength = 0;
    if (lengthValid) strength += 20;
    if (hasUpperCase) strength += 20;
    if (hasLowerCase) strength += 20;
    if (hasNumbers) strength += 20;
    if (hasSpecialChar) strength += 20;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 40) return 'Débil';
    if (passwordStrength <= 80) return 'Media';
    return 'Fuerte';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 40) return 'danger';
    if (passwordStrength <= 80) return 'warning';
    return 'success';
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setLocalError(null);
    
    try {
      if (register) {
        await register(formData.name, formData.email, formData.password);
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Fallback para cuando no se usa AuthContext
        setLocalError('Error: Función de registro no disponible');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar error de autenticación o error local
  const displayError = authError || localError;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Col md={7} lg={6}>
          <div className="text-center mb-4">
            <div className="auth-logo d-inline-block p-3 rounded-circle bg-primary">
              <Lightbulb className="text-white" size={32} />
            </div>
            <h2 className="auth-title mt-3">Crea tu cuenta</h2>
            <p className="auth-subtitle text-muted">Comienza a validar tus hipótesis con Lean Startup Assistant</p>
          </div>
          
          <Card className="shadow border-0 register-card">
            <Card.Body className="p-4 p-md-5">
              {success ? (
                <Alert variant="success" className="d-flex align-items-center mb-4 border-0">
                  <Check2Circle className="me-2" size={24} />
                  <div>
                    <strong>¡Registro exitoso!</strong> Redirigiendo al inicio...
                  </div>
                </Alert>
              ) : (
                <>
                  {displayError && (
                    <Alert variant="danger" className="d-flex align-items-center mb-4 border-0">
                      <ExclamationTriangle className="me-2 flex-shrink-0" size={20} />
                      <div>{displayError}</div>
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Nombre Completo</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <PersonFill className="text-muted" size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ingrese su nombre completo"
                          className="bg-light border-start-0"
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <EnvelopeFill className="text-muted" size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nombre@ejemplo.com"
                          className="bg-light border-start-0"
                          required
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        No compartiremos su correo con nadie más.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Contraseña</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <LockFill className="text-muted" size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Mínimo 6 caracteres"
                          className="bg-light border-start-0 border-end-0"
                          required
                        />
                        <InputGroup.Text 
                          className="bg-light border-start-0 cursor-pointer"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: 'pointer' }}
                        >
                          {showPassword ? 
                            <EyeSlashFill className="text-muted" size={16} /> : 
                            <EyeFill className="text-muted" size={16} />
                          }
                        </InputGroup.Text>
                      </InputGroup>
                      
                      {formData.password && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Fortaleza:</small>
                            <small className={`text-${getPasswordStrengthColor()}`}>
                              {getPasswordStrengthLabel()}
                            </small>
                          </div>
                          <ProgressBar 
                            now={passwordStrength} 
                            variant={getPasswordStrengthColor()} 
                            style={{ height: '6px' }}
                          />
                          
                          <div className="password-requirements mt-3">
                            <small className="d-block mb-2 text-muted">La contraseña debe tener:</small>
                            <div className="d-flex flex-wrap">
                              <div className="password-requirement me-3 mb-2 d-flex align-items-center">
                                {formData.password.length >= 6 ? (
                                  <CheckCircleFill className="me-1 text-success" size={12} />
                                ) : (
                                  <XCircleFill className="me-1 text-muted" size={12} />
                                )}
                                <small className="text-muted">Mínimo 6 caracteres</small>
                              </div>
                              <div className="password-requirement me-3 mb-2 d-flex align-items-center">
                                {/[A-Z]/.test(formData.password) ? (
                                  <CheckCircleFill className="me-1 text-success" size={12} />
                                ) : (
                                  <XCircleFill className="me-1 text-muted" size={12} />
                                )}
                                <small className="text-muted">Mayúsculas</small>
                              </div>
                              <div className="password-requirement me-3 mb-2 d-flex align-items-center">
                                {/\d/.test(formData.password) ? (
                                  <CheckCircleFill className="me-1 text-success" size={12} />
                                ) : (
                                  <XCircleFill className="me-1 text-muted" size={12} />
                                )}
                                <small className="text-muted">Números</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <LockFill className="text-muted" size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Vuelva a ingresar su contraseña"
                          className="bg-light border-start-0 border-end-0"
                          required
                        />
                        <InputGroup.Text 
                          className="bg-light border-start-0 cursor-pointer"
                          onClick={toggleConfirmPasswordVisibility}
                          style={{ cursor: 'pointer' }}
                        >
                          {showConfirmPassword ? 
                            <EyeSlashFill className="text-muted" size={16} /> : 
                            <EyeFill className="text-muted" size={16} />
                          }
                        </InputGroup.Text>
                      </InputGroup>
                      {formData.password && formData.confirmPassword && (
                        <div className="mt-2">
                          {formData.password === formData.confirmPassword ? (
                            <small className="text-success d-flex align-items-center">
                              <CheckCircleFill className="me-1" size={12} />
                              Las contraseñas coinciden
                            </small>
                          ) : (
                            <small className="text-danger d-flex align-items-center">
                              <XCircleFill className="me-1" size={12} />
                              Las contraseñas no coinciden
                            </small>
                          )}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check 
                        type="checkbox" 
                        id="termsAgree" 
                        label={
                          <span className="text-muted small">
                            He leído y acepto los <Link to="/terms" className="text-decoration-none">Términos y Condiciones</Link> y la <Link to="/privacy" className="text-decoration-none">Política de Privacidad</Link>
                          </span>
                        }
                        required
                      />
                    </Form.Group>

                    <div className="d-grid gap-2 mb-4">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="py-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <PersonPlus className="me-2" size={18} />
                            Crear Cuenta
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="mb-0 text-muted">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-decoration-none fw-semibold">
                          Iniciar Sesión
                        </Link>
                      </p>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} Lean Startup Assistant. Todos los derechos reservados.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
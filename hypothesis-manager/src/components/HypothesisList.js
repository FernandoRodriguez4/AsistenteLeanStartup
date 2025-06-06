import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchHypotheses } from '../services/hypothesisService';
import { formatDate } from '../utils/dateFormat';
import { 
  Lightbulb, 
  Calendar3, 
  ArrowRightCircle, 
  ExclamationTriangle,
  PlusCircle, 
  Search 
} from 'react-bootstrap-icons';

const HypothesisList = () => {
  const [hypotheses, setHypotheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const TEXT_TRUNCATE_LIMITS = {
    PROBLEM: 100,
    SEGMENT: 100
  };

  const loadHypotheses = async () => {
    try {
      const data = await fetchHypotheses();
      setHypotheses(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar hipótesis:", err);
      setError('Error al cargar las hipótesis. Por favor, inténtelo de nuevo.');
      setHypotheses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHypotheses();
  }, []);

  const filterHypotheses = () => {
    return hypotheses.filter(hypothesis =>
      hypothesis && hypothesis.name && hypothesis.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );
  };

  const truncateText = (text, limit) => {
    if (!text) return 'No disponible';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const hasArtifacts = (hypothesis) => hypothesis.artifacts && hypothesis.artifacts.length > 0;

  const renderLoadingSpinner = () => (
    <div className="text-center my-5 fade-in">
      <Spinner animation="border" role="status" variant="primary" style={{ width: '4rem', height: '4rem' }}>
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <p className="mt-3 text-primary fw-bold">Cargando hipótesis...</p>
    </div>
  );

  const renderError = () => (
    <Alert variant="danger" className="d-flex align-items-start p-4 my-4">
      <ExclamationTriangle className="me-3 mt-1" size={24} />
      <div>
        <Alert.Heading>Ha ocurrido un error</Alert.Heading>
        <p>{error}</p>
        <div className="mt-3">
          <Button onClick={() => window.location.reload()} variant="outline-danger">
            Reintentar
          </Button>
        </div>
      </div>
    </Alert>
  );

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="mb-0">
        <span className="d-flex align-items-center">
          <Lightbulb className="me-2 text-primary" size={32} />
          Mis Hipótesis
        </span>
      </h2>
      <Link to="/create">
        <Button variant="success" className="d-flex align-items-center">
          <PlusCircle className="me-2" size={18} />
          Nueva Hipótesis
        </Button>
      </Link>
    </div>
  );

  const renderSearchBar = () => (
    <div className="mb-4 position-relative">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Buscar hipótesis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <Card className="empty-state mb-4">
      <Card.Body>
        <div className="empty-state-icon">
          <Lightbulb />
        </div>
        <h4 className="empty-state-title">No hay hipótesis registradas</h4>
        <p className="empty-state-text">
          Comience creando su primera hipótesis de negocio para validarla con la metodología Lean Startup.
        </p>
        <Link to="/create">
          <Button variant="primary" size="lg" className="d-inline-flex align-items-center">
            <PlusCircle className="me-2" size={20} />
            Crear mi primera hipótesis
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );

  const renderHypothesisCard = (hypothesis) => (
    <Col key={hypothesis.id}>
      <Card className="h-100">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <Badge bg={hasArtifacts(hypothesis) ? "success" : "secondary"} className="px-3 py-2">
              {hasArtifacts(hypothesis) ? 'Con artefactos' : 'Sin artefactos'}
            </Badge>
            <small className="text-muted d-flex align-items-center">
              <Calendar3 className="me-1" size={14} />
              {formatDate(hypothesis.createdAt)}
            </small>
          </div>
          
          <Card.Title className="mb-3">{hypothesis.name}</Card.Title>
          
          <Card.Text className="mb-2">
            <strong>Problema:</strong> {truncateText(hypothesis.problem, TEXT_TRUNCATE_LIMITS.PROBLEM)}
          </Card.Text>
          
          <Card.Text>
            <strong>Segmento:</strong> {truncateText(hypothesis.customerSegment, TEXT_TRUNCATE_LIMITS.SEGMENT)}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="bg-white">
          <Link to={`/hypothesis/${hypothesis.id}`} className="w-100">
            <Button variant="outline-primary" className="w-100 d-flex justify-content-center align-items-center">
              Ver Detalles
              <ArrowRightCircle className="ms-2" size={16} />
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );

  const renderNoResults = () => (
    <Col xs={12}>
      <Alert variant="info">
        No se encontraron hipótesis con el término "{searchTerm}". 
        <Button variant="link" onClick={() => setSearchTerm('')}>Limpiar búsqueda</Button>
      </Alert>
    </Col>
  );

  const renderHypothesesGrid = () => {
    const filtered = filterHypotheses();
    
    return (
      <Row className="row-cols-1 row-cols-md-2 g-4 mb-4">
        {filtered.length > 0 ? filtered.map(renderHypothesisCard) : renderNoResults()}
      </Row>
    );
  };

  const renderContent = () => (
    <div className="fade-in">
      {renderHeader()}
      {hypotheses.length > 0 && renderSearchBar()}
      {hypotheses.length === 0 ? renderEmptyState() : renderHypothesesGrid()}
    </div>
  );

  if (loading) return renderLoadingSpinner();
  if (error) return renderError();
  return renderContent();
};

export default HypothesisList;

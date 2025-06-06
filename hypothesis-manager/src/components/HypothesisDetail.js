import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { fetchHypothesisById } from '../services/hypothesisService';
import { formatDate } from '../utils/dateFormat';
import { 
  ArrowLeft, 
  Calendar3, 
  Diagram3Fill, 
  ExclamationTriangle, 
  BoxSeam, 
  GraphUp, 
  JournalText, 
  ArrowRepeat, 
  ArrowClockwise, 
  InfoCircleFill 
} from 'react-bootstrap-icons';

const HypothesisDetail = () => {
  const { id } = useParams();
  const [hypothesis, setHypothesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PHASE_CONFIG = {
    'construir': { name: 'Construir', icon: <BoxSeam size={20} />, color: 'primary' },
    'medir': { name: 'Medir', icon: <GraphUp size={20} />, color: 'success' },
    'aprender': { name: 'Aprender', icon: <JournalText size={20} />, color: 'info' },
    'pivotar': { name: 'Pivotar', icon: <ArrowRepeat size={20} />, color: 'warning' },
    'iterar': { name: 'Iterar', icon: <ArrowClockwise size={20} />, color: 'danger' }
  };

  const HYPOTHESIS_FIELDS = {
    problem: { title: 'Problema', color: 'primary' },
    solution: { title: 'Solución', color: 'success' },
    customerSegment: { title: 'Segmento de Clientes', color: 'info' },
    valueProposition: { title: 'Propuesta de Valor', color: 'warning' }
  };

  const loadHypothesis = async () => {
    try {
      const data = await fetchHypothesisById(id);
      setHypothesis(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar la hipótesis:', err);
      setError('Error al cargar la hipótesis. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHypothesis();
  }, [id]);

  const getTotalArtifacts = () => hypothesis?.artifacts?.length || 0;

  const getArtifactCountByPhase = (phase) => {
    if (!hypothesis?.artifacts) return 0;
    return hypothesis.artifacts.filter(a => a.phase === phase).length;
  };

  const openArtifactsPage = () => window.open(`/artifacts/${hypothesis.id}`, '_blank');

  const renderSpinner = () => (
    <div className="text-center my-5 fade-in">
      <Spinner animation="border" role="status" variant="primary" style={{ width: '4rem', height: '4rem' }}>
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <p className="mt-3 text-primary fw-bold">Cargando detalles de la hipótesis...</p>
    </div>
  );

  const renderErrorAlert = () => (
    <Alert variant="danger" className="d-flex align-items-start p-4 my-4 fade-in">
      <ExclamationTriangle className="me-3 mt-1" size={24} />
      <div>
        <Alert.Heading>Ha ocurrido un error</Alert.Heading>
        <p>{error}</p>
        <div className="mt-3">
          <Button onClick={() => window.location.reload()} variant="outline-danger">Reintentar</Button>
          <Link to="/"><Button variant="outline-secondary" className="ms-2">Volver a la lista</Button></Link>
        </div>
      </div>
    </Alert>
  );

  const renderNotFound = () => (
    <Alert variant="warning" className="fade-in">
      No se encontró la hipótesis solicitada.
      <div className="mt-3">
        <Link to="/"><Button variant="outline-primary">Volver a la lista</Button></Link>
      </div>
    </Alert>
  );

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="mb-0 d-flex align-items-center">
        <Diagram3Fill className="me-2 text-primary" size={28} />
        Detalle de Hipótesis
      </h2>
      <Link to="/">
        <Button variant="outline-secondary" className="d-flex align-items-center">
          <ArrowLeft className="me-2" size={16} />
          Volver a la lista
        </Button>
      </Link>
    </div>
  );

  const renderHypothesisHeader = () => (
    <Card className="mb-4 shadow-sm hypothesis-detail-header">
      <Card.Body className="p-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between">
              <div>
                <h3 className="mb-3">{hypothesis.name}</h3>
                <div className="d-flex align-items-center mb-3">
                  <Calendar3 className="text-muted me-2" size={16} />
                  <span className="text-muted">Creada el {formatDate(hypothesis.createdAt)}</span>
                  <Badge bg="info" className="ms-3 px-3 py-2">{getTotalArtifacts()} artefactos</Badge>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {renderHypothesisFields()}
      </Card.Body>
    </Card>
  );

  const renderFieldCard = (field, value, config) => (
    <Col md={6} className="mb-3" key={field}>
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body>
          <h5 className={`phase-title text-${config.color}`}>{config.title}</h5>
          <p>{value}</p>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderHypothesisFields = () => {
    const fieldOrder = ['problem', 'solution', 'customerSegment', 'valueProposition'];
    const rows = [];
    
    for (let i = 0; i < fieldOrder.length; i += 2) {
      rows.push(
        <Row key={i}>
          {renderFieldCard(fieldOrder[i], hypothesis[fieldOrder[i]], HYPOTHESIS_FIELDS[fieldOrder[i]])}
          {fieldOrder[i + 1] && renderFieldCard(fieldOrder[i + 1], hypothesis[fieldOrder[i + 1]], HYPOTHESIS_FIELDS[fieldOrder[i + 1]])}
        </Row>
      );
    }
    
    return <>{rows}</>;
  };

  const renderPhaseStatistic = (phase, config) => (
    <div className="d-flex align-items-center p-3 bg-light rounded" key={phase}>
      <div className={`rounded-circle bg-${config.color} p-2 text-white me-2`}>
        {config.icon}
      </div>
      <div>
        <div className="fw-bold">{config.name}</div>
        <div className="small text-muted">{getArtifactCountByPhase(phase)} artefactos</div>
      </div>
    </div>
  );

  const renderArtifactsSection = () => (
    <Card className="shadow-sm">
      <Card.Header className="bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4 className="mb-0">Artefactos Lean Startup</h4>
            <InfoCircleFill className="ms-2 text-info" size={16} />
          </div>
          <Button variant="primary" onClick={openArtifactsPage} className="d-flex align-items-center">
            Ver Artefactos
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right ms-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
              <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
            </svg>
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        <p className="mb-4">Explore los artefactos Lean Startup para esta hipótesis. Organizados por las fases del proceso:</p>
        <div className="d-flex flex-wrap gap-3 mb-4">
          {Object.entries(PHASE_CONFIG).map(([phase, config]) => renderPhaseStatistic(phase, config))}
        </div>
        <div className="text-center">
        </div>
      </Card.Body>
    </Card>
  );

  const renderContent = () => (
    <div className="fade-in">
      {renderHeader()}
      {renderHypothesisHeader()}
      {renderArtifactsSection()}
    </div>
  );

  if (loading) return renderSpinner();
  if (error) return renderErrorAlert();
  if (!hypothesis) return renderNotFound();
  return renderContent();
};

export default HypothesisDetail;
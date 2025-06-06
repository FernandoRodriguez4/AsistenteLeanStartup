import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, Spinner, Row, Col, ProgressBar } from 'react-bootstrap';
import { 
  CpuFill,
  Diagram3Fill,
  InfoCircleFill, 
  CheckCircleFill,
  ExclamationTriangleFill
} from 'react-bootstrap-icons';
import { getContextStats } from '../services/contextService';

const ContextInsights = ({ hypothesisId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COHERENCE_LEVELS = {
    NONE: { level: 'none', text: 'Sin contexto', color: 'secondary' },
    BASIC: { level: 'basic', text: 'Básico', color: 'warning' },
    GOOD: { level: 'good', text: 'Bueno', color: 'info' },
    EXCELLENT: { level: 'excellent', text: 'Excelente', color: 'success' }
  };

  const COHERENCE_THRESHOLDS = {
    BASIC: 3,
    GOOD: 10,
    MAX_PERCENTAGE: 15
  };

  
  const loadContextStats = useCallback(async () => {
    try {
      const data = await getContextStats(hypothesisId);
      setStats(data.contextStats);
      setError(null);
    } catch (err) {
      console.error('Error al cargar estadísticas de contexto:', err);
      setError('Error al cargar estadísticas de contexto');
    } finally {
      setLoading(false);
    }
  }, [hypothesisId]); 

  useEffect(() => {
    if (hypothesisId) loadContextStats();
  }, [hypothesisId, loadContextStats]); 

  const getCoherenceLevel = () => {
    if (!stats || stats.totalContexts === 0) return COHERENCE_LEVELS.NONE;
    if (stats.totalContexts < COHERENCE_THRESHOLDS.BASIC) return COHERENCE_LEVELS.BASIC;
    if (stats.totalContexts < COHERENCE_THRESHOLDS.GOOD) return COHERENCE_LEVELS.GOOD;
    return COHERENCE_LEVELS.EXCELLENT;
  };

  const calculateCoherencePercentage = () => {
    if (!stats) return 0;
    return Math.min((stats.totalContexts / COHERENCE_THRESHOLDS.MAX_PERCENTAGE) * 100, 100);
  };

  const renderLoading = () => (
    <Card className="mb-3 shadow-sm border-info">
      <Card.Body className="text-center py-3">
        <Spinner animation="border" size="sm" className="me-2" />
        <small className="text-muted">Cargando información de coherencia...</small>
      </Card.Body>
    </Card>
  );

  const renderError = () => (
    <Card className="mb-3 shadow-sm border-warning">
      <Card.Header className="bg-warning bg-opacity-10 py-2">
        <div className="d-flex align-items-center">
          <ExclamationTriangleFill className="text-warning me-2" size={16} />
          <small className="fw-bold text-warning mb-0">Sistema de Coherencia</small>
        </div>
      </Card.Header>
      <Card.Body className="py-3">
        <small className="text-muted">
          El sistema de coherencia con IA está configurándose. Los nuevos artefactos generados comenzarán a mantener coherencia automáticamente.
        </small>
      </Card.Body>
    </Card>
  );

  const renderHeader = (coherence) => (
    <Card.Header className="bg-info bg-opacity-10 py-3">
      <Row className="align-items-center">
        <Col>
          <div className="d-flex align-items-center">
            <CpuFill className="text-info me-2" size={20} />
            <div>
              <h6 className="mb-0 text-info">Sistema de Coherencia con IA</h6>
              <small className="text-muted">Los artefactos mantienen coherencia automáticamente</small>
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <Badge bg={coherence.color} className="px-3 py-2">{coherence.text}</Badge>
        </Col>
      </Row>
    </Card.Header>
  );

  const renderContextCount = () => (
    <div className="d-flex align-items-center mb-2">
      <Diagram3Fill className="text-muted me-2" size={16} />
      <small className="text-muted">
        <strong>{stats.totalContexts}</strong> artefactos con contexto vectorial
      </small>
    </div>
  );

  const renderProgressBar = (coherencePercentage, coherence) => (
    <div className="mb-2">
      <small className="text-muted d-block mb-1">
        Nivel de coherencia: {Math.round(coherencePercentage)}%
      </small>
      <ProgressBar 
        now={coherencePercentage} 
        variant={coherence.color}
        style={{ height: '6px' }}
      />
    </div>
  );

  const renderPhaseDistribution = () => {
    if (!stats.phaseDistribution || stats.phaseDistribution.length === 0) return null;
    return (
      <div className="d-flex flex-wrap gap-1 justify-content-md-end">
        {stats.phaseDistribution.map(phase => (
          <Badge key={phase.phase} bg="light" text="dark" className="small px-2 py-1">
            {phase.phase}: {phase.count}
          </Badge>
        ))}
      </div>
    );
  };

  const renderStatusMessage = () => {
    if (stats.totalContexts > 0) {
      return (
        <div className="d-flex align-items-center">
          <CheckCircleFill className="text-success me-2" size={14} />
          <small className="text-success">
            Los nuevos artefactos generados con IA mantendrán coherencia con el contexto existente
          </small>
        </div>
      );
    }
    return (
      <div className="d-flex align-items-center">
        <InfoCircleFill className="text-info me-2" size={14} />
        <small className="text-info">
          Genere su primer artefacto con IA para comenzar a construir coherencia contextual
        </small>
      </div>
    );
  };

  const renderMainContent = () => {
    const coherence = getCoherenceLevel();
    const coherencePercentage = calculateCoherencePercentage();

    return (
      <Card className="mb-4 shadow-sm border-info">
        {renderHeader(coherence)}
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md={6}>
              {renderContextCount()}
              {stats.totalContexts > 0 && renderProgressBar(coherencePercentage, coherence)}
            </Col>
            <Col md={6}>
              {renderPhaseDistribution()}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>{renderStatusMessage()}</Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!stats) return null;
  return renderMainContent();
};

export default ContextInsights;
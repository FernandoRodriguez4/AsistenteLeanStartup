import React, { useState, useEffect } from 'react';
import { useParams,  } from 'react-router-dom';
import { Container, Tabs, Tab, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { fetchHypothesisById } from '../services/hypothesisService';
import ArtifactList from './ArtifactList';
import ContextInsights from './ContextInsights';
import { 
  BoxSeam, 
  GraphUp, 
  JournalText, 
  ArrowRepeat, 
  ArrowClockwise,
  ArrowLeft,
  InfoCircleFill
} from 'react-bootstrap-icons';

const ArtifactsPage = () => {
  const { id } = useParams();
  const [hypothesis, setHypothesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState('construir');

  const VALID_PHASES = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
  const DEFAULT_PHASE = 'construir';
  const URL_PARAM_PHASE = 'phase';

  const PHASE_CONFIG = {
    'construir': { name: 'Construir', icon: <BoxSeam size={18} /> },
    'medir': { name: 'Medir', icon: <GraphUp size={18} /> },
    'aprender': { name: 'Aprender', icon: <JournalText size={18} /> },
    'pivotar': { name: 'Pivotar', icon: <ArrowRepeat size={18} /> },
    'iterar': { name: 'Iterar', icon: <ArrowClockwise size={18} /> }
  };

  const getPhaseFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const phase = urlParams.get(URL_PARAM_PHASE);
    return VALID_PHASES.includes(phase) ? phase : null;
  };

  const updateURLPhase = (phase) => {
    const url = new URL(window.location);
    url.searchParams.set(URL_PARAM_PHASE, phase);
    window.history.pushState({}, '', url);
  };

  const loadHypothesisData = async () => {
    try {
      const data = await fetchHypothesisById(id);
      setHypothesis(data);
      const urlPhase = getPhaseFromURL();
      if (urlPhase) setActiveKey(urlPhase);
      setError(null);
    } catch (err) {
      console.error('Error al cargar la hipótesis:', err);
      setError('Error al cargar la hipótesis. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHypothesisData();
  }, [id]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    updateURLPhase(key);
  };

  const getArtifactCountByPhase = (phase) => {
    if (!hypothesis?.artifacts) return 0;
    return hypothesis.artifacts.filter(a => a.phase === phase).length;
  };

  const getArtifactsByPhase = (phase) => {
    if (!hypothesis?.artifacts) return [];
    return hypothesis.artifacts.filter(a => a.phase === phase);
  };

  const renderLoading = () => (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">Cargando artefactos...</p>
    </Container>
  );

  const renderError = () => (
    <Container className="py-5">
      <Alert variant="danger">
        {error || 'No se encontró la hipótesis solicitada'}
      </Alert>
    </Container>
  );

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="mb-0">Artefactos Lean Startup</h2>
      <Button 
        variant="outline-secondary" 
        className="d-flex align-items-center"
        onClick={() => window.close()}
      >
        <ArrowLeft className="me-2" size={16} />
        Cerrar
      </Button>
    </div>
  );

  const renderHypothesisInfo = () => (
    <div className="mb-4">
      <h3>{hypothesis.name}</h3>
      <div className="d-flex align-items-center text-muted">
        <InfoCircleFill className="me-2" size={14} />
        <p className="mb-0">Seleccione una fase para ver sus artefactos</p>
      </div>
    </div>
  );

  const renderTabTitle = (phase) => {
    const config = PHASE_CONFIG[phase];
    const count = getArtifactCountByPhase(phase);
    return (
      <span className="d-flex align-items-center">
        {config.icon}
        <span className="ms-2">{config.name}</span>
        <Badge bg="light" text="dark" className="ms-2">{count}</Badge>
      </span>
    );
  };

  const renderPhaseTab = (phase) => (
    <Tab key={phase} eventKey={phase} title={renderTabTitle(phase)}>
      <ArtifactList 
        artifacts={getArtifactsByPhase(phase)} 
        phase={phase} 
        hypothesisId={hypothesis.id} 
      />
    </Tab>
  );

  const renderTabs = () => (
    <Tabs
      activeKey={activeKey}
      onSelect={handleTabChange}
      className="mb-4 nav-tabs-custom"
    >
      {VALID_PHASES.map(renderPhaseTab)}
    </Tabs>
  );

  const renderContent = () => (
    <Container className="py-4">
      {renderHeader()}
      {renderHypothesisInfo()}
      <ContextInsights hypothesisId={id} />
      {renderTabs()}
    </Container>
  );

  if (loading) return renderLoading();
  if (error || !hypothesis) return renderError();
  return renderContent();
};

export default ArtifactsPage;
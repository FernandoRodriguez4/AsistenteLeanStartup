import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Spinner, Alert, Row, Col, Badge, Form, Table, ButtonGroup } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateArtifacts } from '../services/artifactService';
import { generateArtifactWithAI, improveArtifactWithAI } from '../services/aiService';
import { fetchHypothesisById } from '../services/hypothesisService';
import { 
  FileEarmarkText, 
  PlusCircle, 
  Eye, 
  ExclamationTriangle, 
  EmojiNeutral,
  Download, 
  Share,
  BoxSeam, 
  GraphUp, 
  JournalText, 
  ArrowRepeat, 
  ArrowClockwise,
  Robot,
  Magic,
  CodeSlash,
  FileRichtext
} from 'react-bootstrap-icons';

const ArtifactList = ({ artifacts, phase, hypothesisId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [hypothesis, setHypothesis] = useState(null);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [improvePrompt, setImprovePrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [viewMode, setViewMode] = useState('formatted');

  const PHASE_CONFIG = {
    'construir': { name: 'Construir', description: 'Construye un producto mínimo viable para probar tu hipótesis de manera rápida y económica.', color: 'primary', icon: <BoxSeam size={20} /> },
    'medir': { name: 'Medir', description: 'Recopila datos y métricas sobre cómo los usuarios interactúan con tu solución para validar tu propuesta.', color: 'success', icon: <GraphUp size={20} /> },
    'aprender': { name: 'Aprender', description: 'Analiza los datos recopilados para validar o invalidar tu hipótesis y tomar decisiones informadas.', color: 'info', icon: <JournalText size={20} /> },
    'pivotar': { name: 'Pivotar', description: 'Si es necesario, cambia la dirección estratégica de tu proyecto basado en los aprendizajes obtenidos.', color: 'warning', icon: <ArrowRepeat size={20} /> },
    'iterar': { name: 'Iterar', description: 'Mejora continuamente tu producto o servicio basado en los insights obtenidos durante el proceso.', color: 'danger', icon: <ArrowClockwise size={20} /> }
  };

  const currentPhaseConfig = PHASE_CONFIG[phase];
  const AI_ANALYZING_MESSAGE = 'Analizando tu hipótesis...';
  const AI_GENERATING_MESSAGE = 'Generando artefacto personalizado...';
  const AI_SUCCESS_MESSAGE = '¡Artefacto generado con éxito!';
  const ARTIFACT_REFRESH_DELAY = 1000;
  const AI_STATUS_UPDATE_DELAY = 1500;

  // Componentes mejorados para markdown
  const markdownComponents = {
    h1: ({children}) => <h1 className="h3 mb-3 mt-4 text-primary">{children}</h1>,
    h2: ({children}) => <h2 className="h4 mb-3 mt-4">{children}</h2>,
    h3: ({children}) => <h3 className="h5 mb-2 mt-3">{children}</h3>,
    h4: ({children}) => <h4 className="h6 mb-2 mt-3">{children}</h4>,
    p: ({children}) => <p className="mb-3 text-body">{children}</p>,
    ul: ({children}) => <ul className="ms-3 mb-3">{children}</ul>,
    ol: ({children}) => <ol className="ms-3 mb-3">{children}</ol>,
    li: ({children}) => <li className="mb-2">{children}</li>,
    code: ({inline, className, children, ...props}) => {
      if (inline) {
        return <code className="bg-light px-2 py-1 rounded text-danger">{children}</code>;
      }
      
      // Para bloques de código
      return (
        <pre className="bg-light p-3 rounded overflow-auto mb-3">
          <code className={className}>{children}</code>
        </pre>
      );
    },
    pre: ({children, ...props}) => {
      // Si el pre contiene un code, dejar que el componente code lo maneje
      if (children?.props?.mdxType === 'code' || children?.type?.name === 'code') {
        return <>{children}</>;
      }
      // Si no, renderizar como pre normal
      return <pre className="bg-light p-3 rounded overflow-auto mb-3" {...props}>{children}</pre>;
    },
    blockquote: ({children}) => (
      <blockquote className="border-start border-4 border-primary ps-3 my-3 text-muted">
        {children}
      </blockquote>
    ),
    table: ({children}) => (
      <div className="table-responsive my-3">
        <Table striped bordered hover size="sm">
          {children}
        </Table>
      </div>
    ),
    a: ({href, children}) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
        {children}
      </a>
    ),
    hr: () => <hr className="my-4" />,
    strong: ({children}) => <strong className="fw-bold">{children}</strong>,
    em: ({children}) => <em className="fst-italic">{children}</em>
  };

  useEffect(() => {
    const loadHypothesis = async () => {
      try {
        const data = await fetchHypothesisById(hypothesisId);
        setHypothesis(data);
      } catch (err) {
        console.error('Error al cargar la hipótesis:', err);
      }
    };
    loadHypothesis();
  }, [hypothesisId]);

  const resetError = () => setError(null);
  const showError = (message) => setError(message);
  const refreshPage = () => window.location.reload();

  const handleGenerateArtifacts = async () => {
    setLoading(true);
    resetError();
    try {
      await generateArtifacts(hypothesisId, phase);
      refreshPage();
    } catch (err) {
      console.error('Error al generar artefactos:', err);
      showError('Error al generar los artefactos. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const updateAIStatus = (message, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => setAiStatus(message), delay);
    } else {
      setAiStatus(message);
    }
  };

  const handleGenerateAIArtifact = async () => {
    if (!hypothesis) {
      showError('No se pudo cargar la información de la hipótesis para la generación con IA.');
      return;
    }
    
    setIsGeneratingAI(true);
    resetError();
    updateAIStatus(AI_ANALYZING_MESSAGE);
    
    try {
      updateAIStatus(AI_GENERATING_MESSAGE, AI_STATUS_UPDATE_DELAY);
      await generateArtifactWithAI(hypothesisId, phase);
      updateAIStatus(AI_SUCCESS_MESSAGE);
      setTimeout(refreshPage, ARTIFACT_REFRESH_DELAY);
    } catch (err) {
      console.error('Error al generar el artefacto con IA:', err);
      showError('Error al generar el artefacto con IA. Por favor, inténtelo de nuevo.');
    } finally {
      setTimeout(() => {
        setIsGeneratingAI(false);
        updateAIStatus('');
      }, ARTIFACT_REFRESH_DELAY);
    }
  };

  const handleShowArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    setViewMode('formatted');
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const createImprovePrompt = (artifact) => {
    return `Por favor, mejora este artefacto de la fase de ${currentPhaseConfig.name.toLowerCase()} haciéndolo más detallado y específico para mi caso particular.`;
  };

  const handleShowImproveModal = (artifact) => {
    setSelectedArtifact(artifact);
    setImprovePrompt(createImprovePrompt(artifact));
    setShowImproveModal(true);
  };

  const handleCloseImproveModal = () => {
    setShowImproveModal(false);
    setImprovePrompt('');
    resetError();
  };

  const handleImproveArtifact = async () => {
    setIsImproving(true);
    resetError();
    try {
      await improveArtifactWithAI(selectedArtifact.id, improvePrompt);
      setShowImproveModal(false);
      refreshPage();
    } catch (err) {
      console.error('Error al mejorar el artefacto con IA:', err);
      showError('Error al mejorar el artefacto con IA. Por favor, inténtelo de nuevo.');
    } finally {
      setIsImproving(false);
    }
  };

  const createArtifactContent = () => {
    if (!selectedArtifact) return '';
    return `# ${selectedArtifact.name}
${selectedArtifact.description}

## Fase: ${currentPhaseConfig.name}

${selectedArtifact.content}
`;
  };

  const downloadArtifact = () => {
    if (!selectedArtifact) return;
    const content = createArtifactContent();
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedArtifact.name.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareArtifact = () => {
    if (!selectedArtifact) return;
    const content = `${selectedArtifact.name}\n${selectedArtifact.description}\n\n${selectedArtifact.content}`;
    navigator.clipboard.writeText(content)
      .then(() => alert('Contenido copiado al portapapeles'))
      .catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        alert('No se pudo copiar al portapapeles');
      });
  };

  const isAIGenerated = (artifact) => artifact.name.includes('Personalizado');
  const isImproved = (artifact) => artifact.name.includes('Mejorado');

  const renderPhaseHeader = () => (
    <div className="d-flex align-items-center mb-2">
      <div className={`rounded-circle p-2 me-3 text-white bg-${currentPhaseConfig.color}`}>
        {currentPhaseConfig.icon}
      </div>
      <div>
        <h4 className="mb-1">{currentPhaseConfig.name}</h4>
        <p className="text-muted mb-0">{currentPhaseConfig.description}</p>
      </div>
    </div>
  );

  const renderError = () => error && (
    <Alert variant="danger" className="d-flex align-items-center my-3">
      <ExclamationTriangle className="me-3" size={20} />
      <div>{error}</div>
    </Alert>
  );

  const renderEmptyState = () => (
    <Card className="empty-state mt-4 border-0 shadow-sm">
      <Card.Body>
        <div className="empty-state-icon"><EmojiNeutral /></div>
        <h5 className="empty-state-title">No hay artefactos generados</h5>
        <p className="empty-state-text">
          Aún no se han generado artefactos para la fase de <strong>{currentPhaseConfig.name}</strong>. 
          Haga clic en uno de los botones para generar artefactos.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button 
            variant="primary" 
            size="lg"
            className="d-inline-flex align-items-center px-4 py-3"
            onClick={handleGenerateArtifacts}
            disabled={loading || isGeneratingAI}
          >
            {loading ? renderLoadingButton('Generando...') : renderIconButton(<PlusCircle className="me-2" size={20} />, 'Generar Plantillas')}
          </Button>
          <Button 
            variant="success" 
            size="lg"
            className="d-inline-flex align-items-center px-4 py-3"
            onClick={handleGenerateAIArtifact}
            disabled={loading || isGeneratingAI}
          >
            <Robot className="me-2" size={20} />
            {isGeneratingAI ? renderLoadingButton(aiStatus || 'Generando con IA...') : 'Generar con IA'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const renderLoadingButton = (text) => (
    <>
      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
      <span>{text}</span>
    </>
  );

  const renderIconButton = (icon, text) => (
    <>
      {icon}
      {text}
    </>
  );

  const renderArtifactBadges = (artifact) => (
    <>
      {isAIGenerated(artifact) && (
        <Badge bg="success" className="ms-2 px-2 py-1">
          <Robot size={12} className="me-1" />
          IA
        </Badge>
      )}
      {isImproved(artifact) && (
        <Badge bg="info" className="ms-2 px-2 py-1">
          <Magic size={12} className="me-1" />
          Mejorado
        </Badge>
      )}
    </>
  );

  const renderArtifactCard = (artifact) => (
    <Col key={artifact.id}>
      <Card className="h-100 shadow-sm border-0 artifact-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Badge bg={currentPhaseConfig.color} className="px-3 py-2">
              {currentPhaseConfig.name}
            </Badge>
            <div className="text-end">
              <FileEarmarkText size={24} className={`text-${currentPhaseConfig.color}`} />
            </div>
          </div>
          <Card.Title className="fs-5 mb-3">
            {artifact.name}
            {renderArtifactBadges(artifact)}
          </Card.Title>
          <Card.Text className="artifact-description">{artifact.description}</Card.Text>
        </Card.Body>
        <Card.Footer className="bg-white border-top-0 pt-0">
          <div className="d-grid gap-2">
            <Button variant="outline-primary" className="d-flex justify-content-center align-items-center" onClick={() => handleShowArtifact(artifact)}>
              <Eye className="me-2" size={16} />
              Ver Detalles
            </Button>
            <Button variant="outline-success" className="d-flex justify-content-center align-items-center" onClick={() => handleShowImproveModal(artifact)}>
              <Magic className="me-2" size={16} />
              Mejorar con IA
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );

  const renderAddMoreCard = () => (
    <Col>
      <Card className="h-100 shadow-sm border-0 artifact-card bg-light">
        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
          <div className={`rounded-circle p-3 mb-3 text-white bg-${currentPhaseConfig.color}`}>
            <PlusCircle size={32} />
          </div>
          <h5 className="mb-3">Añadir más artefactos</h5>
          <p className="text-muted mb-4">
            Genere artefactos adicionales para complementar su estrategia en la fase de {currentPhaseConfig.name.toLowerCase()}.
          </p>
          <div className="d-grid gap-2 w-100">
            <Button variant="outline-primary" className="d-flex justify-content-center align-items-center" onClick={handleGenerateArtifacts} disabled={loading || isGeneratingAI}>
              <PlusCircle className="me-2" size={16} />
              Plantillas
            </Button>
            <Button variant="outline-success" className="d-flex justify-content-center align-items-center" onClick={handleGenerateAIArtifact} disabled={loading || isGeneratingAI}>
              <Robot className="me-2" size={16} />
              IA Personalizada
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderArtifactsGrid = () => (
    <Row className="row-cols-1 row-cols-md-2 g-4 mt-3 artifact-grid">
      {artifacts.map(renderArtifactCard)}
      {renderAddMoreCard()}
    </Row>
  );

  const renderModalHeader = () => (
    <Modal.Header closeButton className="border-bottom-0 pb-0">
      <Modal.Title className="d-flex align-items-center">
        <div className={`rounded-circle p-2 me-3 text-white bg-${currentPhaseConfig.color}`}>
          {currentPhaseConfig.icon}
        </div>
        {selectedArtifact.name}
        {renderArtifactBadges(selectedArtifact)}
      </Modal.Title>
    </Modal.Header>
  );

  const renderViewModeToggle = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold mb-0">Contenido</h6>
      <ButtonGroup size="sm">
        <Button 
          variant={viewMode === 'formatted' ? 'primary' : 'outline-primary'}
          onClick={() => setViewMode('formatted')}
        >
          <FileRichtext className="me-1" size={14} />
          Vista Formateada
        </Button>
        <Button 
          variant={viewMode === 'source' ? 'primary' : 'outline-primary'}
          onClick={() => setViewMode('source')}
        >
          <CodeSlash className="me-1" size={14} />
          Código Fuente
        </Button>
      </ButtonGroup>
    </div>
  );

  // Función mejorada para limpiar el contenido
  const cleanMarkdownContent = (content) => {
    if (!content) return '';
    
    let cleaned = content.trim();
    
    // Primero, detectar si el contenido está envuelto en tags HTML de código
    // Patrón para detectar <pre> y <code> tags
    const preCodePattern = /<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi;
    const codePattern = /<code[^>]*>([\s\S]*?)<\/code>/gi;
    
    // Si encuentra el patrón de pre>code, extraer solo el contenido interno
    let match = preCodePattern.exec(cleaned);
    if (match) {
      cleaned = match[1];
    } else {
      // Si solo encuentra code tags
      match = codePattern.exec(cleaned);
      if (match) {
        cleaned = match[1];
      }
    }
    
    // Decodificar entidades HTML
    const textarea = document.createElement('textarea');
    textarea.innerHTML = cleaned;
    cleaned = textarea.value;
    
    // Eliminar backticks al inicio y al final con diferentes formatos
    // Primero intentar con el formato ```markdown o ```md
    if (cleaned.startsWith('```markdown') || cleaned.startsWith('```md')) {
      cleaned = cleaned.replace(/^```(markdown|md)\n?/, '');
    } else if (cleaned.startsWith('```')) {
      // Si empieza con ``` sin especificar lenguaje
      cleaned = cleaned.replace(/^```\n?/, '');
    }
    
    // Eliminar backticks al final
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/\n?```$/, '');
    }
    
    // Si aún tiene backticks, intentar limpiar de forma más agresiva
    while (cleaned.includes('```') && cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
      if (cleaned.startsWith('markdown\n') || cleaned.startsWith('md\n')) {
        cleaned = cleaned.substring(cleaned.indexOf('\n') + 1);
      }
    }
    
    // Eliminar backticks finales si quedan
    while (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    
    // Limpiar tags HTML duplicados o mal formados
    cleaned = cleaned.replace(/<pre><pre/g, '<pre');
    cleaned = cleaned.replace(/<\/pre><\/pre>/g, '</pre>');
    cleaned = cleaned.replace(/<code><code/g, '<code');
    cleaned = cleaned.replace(/<\/code><\/code>/g, '</code>');
    
    // Trim final
    cleaned = cleaned.trim();
    
    console.log('Contenido limpio final:', cleaned.substring(0, 200) + '...'); // Para debug
    
    return cleaned;
  };

  const renderModalBody = () => {
    // Obtener el contenido limpio
    const cleanedContent = cleanMarkdownContent(selectedArtifact.content);
    
    // Para debug - ver exactamente qué está pasando
    console.log('=== DEBUG CONTENIDO ===');
    console.log('Tipo de contenido:', typeof selectedArtifact.content);
    console.log('Primeros 500 caracteres originales:', selectedArtifact.content.substring(0, 500));
    console.log('Primeros 500 caracteres limpios:', cleanedContent.substring(0, 500));
    console.log('¿Contiene <pre>?', selectedArtifact.content.includes('<pre>'));
    console.log('¿Contiene ```?', selectedArtifact.content.includes('```'));
    
    return (
      <Modal.Body className="pt-2">
        <Badge bg={currentPhaseConfig.color} className="mb-3">
          Fase: {currentPhaseConfig.name}
        </Badge>
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h6 className="fw-bold mb-2">Descripción</h6>
            <p>{selectedArtifact.description}</p>
          </Card.Body>
        </Card>
        <Card className="border-0 shadow-sm">
          <Card.Body>
            {renderViewModeToggle()}
            <div className="artifact-content markdown-rendered">
              {viewMode === 'formatted' ? (
                <div className="formatted-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {cleanedContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <pre className="bg-light p-3 rounded overflow-auto">
                  <code>{selectedArtifact.content}</code>
                </pre>
              )}
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
    );
  };

  const renderModalFooter = () => (
    <Modal.Footer className="border-top-0">
      <div className="d-flex justify-content-between w-100">
        <div>
          <Button variant="outline-secondary" className="me-2 d-flex align-items-center" onClick={downloadArtifact}>
            <Download className="me-2" size={16} />
            Descargar
          </Button>
          <Button variant="outline-primary" className="d-flex align-items-center" onClick={shareArtifact}>
            <Share className="me-2" size={16} />
            Compartir
          </Button>
        </div>
        <div>
          <Button variant="success" className="me-2 d-flex align-items-center" onClick={() => { handleCloseModal(); handleShowImproveModal(selectedArtifact); }}>
            <Magic className="me-2" size={16} />
            Mejorar con IA
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </div>
    </Modal.Footer>
  );

  const renderDetailsModal = () => (
    <Modal show={showModal} onHide={handleCloseModal} size="lg" centered dialogClassName="artifact-modal">
      {selectedArtifact && (
        <>
          {renderModalHeader()}
          {renderModalBody()}
          {renderModalFooter()}
        </>
      )}
    </Modal>
  );

  const renderImproveModalHeader = () => (
    <Modal.Header closeButton>
      <Modal.Title className="d-flex align-items-center">
        <Magic className="me-2 text-success" size={24} />
        Mejorar Artefacto con IA
      </Modal.Title>
    </Modal.Header>
  );

  const renderImproveInstructions = () => (
    <>
      <div className="mb-4">
        <h5>Artefacto a mejorar: {selectedArtifact.name}</h5>
        <Badge bg={currentPhaseConfig.color} className="mb-3">
          Fase: {currentPhaseConfig.name}
        </Badge>
      </div>
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Instrucciones para la IA</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          Modifique este prompt para personalizar cómo la IA mejorará su artefacto.
        </Form.Text>
        <Form.Control
          as="textarea"
          rows={5}
          value={improvePrompt}
          onChange={(e) => setImprovePrompt(e.target.value)}
          placeholder="Indique aquí sus instrucciones específicas para mejorar el artefacto..."
        />
      </Form.Group>
      <div className="bg-light p-3 rounded mb-3">
        <h6 className="fw-bold mb-2">Sugerencias de mejora:</h6>
        <ul className="small">
          <li>Solicite ejemplos más concretos para su industria o modelo de negocio</li>
          <li>Pida que se incluyan herramientas o metodologías específicas</li>
          <li>Solicite más detalles sobre métricas o KPIs relevantes</li>
          <li>Pida instrucciones paso a paso más detalladas</li>
        </ul>
      </div>
    </>
  );

  const renderImproveModalFooter = () => (
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseImproveModal}>Cancelar</Button>
      <Button variant="success" onClick={handleImproveArtifact} disabled={isImproving} className="d-flex align-items-center">
        {isImproving ? renderLoadingButton('Procesando...') : renderIconButton(<Magic className="me-2" size={18} />, 'Mejorar con IA')}
      </Button>
    </Modal.Footer>
  );

  const renderImproveModal = () => (
    <Modal show={showImproveModal} onHide={handleCloseImproveModal} size="lg" centered>
      {selectedArtifact && (
        <>
          {renderImproveModalHeader()}
          <Modal.Body>
            {renderError()}
            {renderImproveInstructions()}
          </Modal.Body>
          {renderImproveModalFooter()}
        </>
      )}
    </Modal>
  );

  return (
    <div className="fade-in">
      {renderPhaseHeader()}
      {renderError()}
      {artifacts.length === 0 ? renderEmptyState() : renderArtifactsGrid()}
      {renderDetailsModal()}
      {renderImproveModal()}
    </div>
  );
};

export default ArtifactList;
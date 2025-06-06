import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import HypothesisForm from './components/HypothesisForm';
import HypothesisList from './components/HypothesisList';
import HypothesisDetail from './components/HypothesisDetail';
import ArtifactsPage from './components/ArtifactsPage'; // Importar el nuevo componente
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container className="mt-4 pb-5">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <HypothesisList />
              </ProtectedRoute>
            } />
            
            <Route path="/create" element={
              <ProtectedRoute>
                <HypothesisForm />
              </ProtectedRoute>
            } />
            
            <Route path="/hypothesis/:id" element={
              <ProtectedRoute>
                <HypothesisDetail />
              </ProtectedRoute>
            } />
            
            {/* Nueva ruta para la página de artefactos */}
            <Route path="/artifacts/:id" element={
              <ProtectedRoute>
                <ArtifactsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
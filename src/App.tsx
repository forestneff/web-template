import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WelcomePortalPage } from './pages/WelcomePortalPage';
import { ClientSubpage } from './pages/ClientSubpage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Agency Welcome Portal & Intake Launcher */}
          <Route path="/" element={<WelcomePortalPage />} />

          {/* Dynamic Client Landing Page Subpage */}
          <Route path="/:businessname" element={<ClientSubpage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/Overview';
import { ForecastPage } from './pages/Forecast';
import { ModelWeightsPage } from './pages/ModelWeights';
import { VerificationPage } from './pages/Verification';
import { ArchitecturePage } from './pages/Architecture';
import { ApiPage } from './pages/Api';
import { DocumentationPage } from './pages/Documentation';
import { ContactPage } from './pages/Contact';
import { PrivacyPage, TermsPage } from './pages/Legal';
import { NotFoundPage } from './pages/NotFound';
import { setFavicon } from './utils/favicon';

export function App() {
  useEffect(() => {
    setFavicon();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/weights" element={<ModelWeightsPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>);

}
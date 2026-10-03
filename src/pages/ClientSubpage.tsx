import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientConfig } from '../hooks/useClientConfig';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Offerings } from '../components/sections/Offerings';
import { About } from '../components/sections/About';
import { SocialProof } from '../components/sections/SocialProof';
import { Contact } from '../components/sections/Contact';
import { JsonConfigDevDrawer } from '../components/ui/JsonConfigDevDrawer';
import { ConsultationBar } from '../components/consultation/ConsultationBar';
import { getClientBySlug, saveClient, type StoredClientRecord } from '../services/clientStorage';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { useAuth } from '../context/AuthContext';
import type { ClientConfig } from '../types/config';

export const ClientSubpage: React.FC = () => {
  const { businessname } = useParams<{ businessname: string }>();
  const navigate = useNavigate();
  const slug = businessname || 'aeroscalesolutions';

  const [clientRecord, setClientRecord] = useState<StoredClientRecord | null>(() =>
    getClientBySlug(slug)
  );

  useEffect(() => {
    setClientRecord(getClientBySlug(slug));
  }, [slug]);

  if (!clientRecord) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <Container className="max-w-md text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-outfit text-white">
              Client Mockup Not Found
            </h1>
            <p className="text-sm text-slate-400">
              No configuration currently registered under{' '}
              <span className="font-mono text-amber-400">/{slug}</span>.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Welcome Portal</span>
            </button>
            <button
              onClick={() => navigate('/aeroscalesolutions')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span>View Baseline Mockup (AeroScale)</span>
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <ActiveClientView
      key={`${slug}-${clientRecord.activeVersion}`}
      slug={slug}
      record={clientRecord}
      initialConfig={clientRecord.config}
      onRecordUpdate={(updated) => setClientRecord(updated)}
    />
  );
};

interface ActiveClientViewProps {
  slug: string;
  record: StoredClientRecord;
  initialConfig: ClientConfig;
  onRecordUpdate: (updated: StoredClientRecord) => void;
}

const ActiveClientView: React.FC<ActiveClientViewProps> = ({
  slug,
  record,
  initialConfig,
  onRecordUpdate,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    config,
    rawJsonString,
    updateRawJson,
    resetToDefault,
    validationErrors,
    isValid,
  } = useClientConfig(initialConfig);

  // Sync edits back to localStorage whenever valid config updates
  useEffect(() => {
    if (isValid && config) {
      const saved = saveClient(slug, config, user);
      onRecordUpdate(saved);
    }
  }, [config, isValid, slug, user]);

  const handleOpenDrawer = () => {
    const devBtn = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Open Configuration Dev Drawer"]'
    );
    if (devBtn) {
      devBtn.click();
    }
  };

  const handleConfigReload = (newConfig: ClientConfig) => {
    updateRawJson(JSON.stringify(newConfig, null, 2));
  };

  const handleVariationCreated = (newSlug: string) => {
    navigate(`/${newSlug}`);
  };

  return (
    <div className="min-h-screen bg-themeBg text-themeText selection:bg-themeAccent/20 selection:text-themeAccent">
      {/* Top Consultation & Review Toolbar */}
      <ConsultationBar
        slug={slug}
        config={config}
        record={record}
        onOpenDrawer={handleOpenDrawer}
        onBackToPortal={() => navigate('/')}
        onConfigReload={handleConfigReload}
        onVariationCreated={handleVariationCreated}
      />

      {/* Dynamic Client Navbar */}
      <Navbar config={config} showPortalLink={true} />

      {/* Main Client Content Sections */}
      <main id="main-content">
        {/* Hero Section */}
        <Hero data={config.hero} brandTagline={config.brand.tagline} />

        {/* Offerings Section */}
        <Offerings data={config.offerings} />

        {/* About Section (Resilient, zero layout collapse) */}
        {config.about && <About data={config.about} />}

        {/* Social Proof Section (Resilient) */}
        {config.socialProof && <SocialProof data={config.socialProof} />}

        {/* Contact Section (Branching: calendar, email, form) */}
        {config.contact && <Contact data={config.contact} brandName={config.brand.name} />}
      </main>

      {/* Dynamic Client Footer */}
      <Footer config={config} />

      {/* Floating Quick Return to Portal Link */}
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold shadow-2xl bg-slate-950/90 text-white border border-indigo-500/40 backdrop-blur-md hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all group"
        title="Return to Welcome Landing Portal"
      >
        <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
        <span>Back to Portal</span>
      </button>

      {/* Live Interactive Dev Drawer */}
      <JsonConfigDevDrawer
        rawJson={rawJsonString}
        onUpdateJson={updateRawJson}
        onReset={resetToDefault}
        validationErrors={validationErrors}
        isValid={isValid}
      />
    </div>
  );
};

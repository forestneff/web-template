import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Download,
  ExternalLink,
  Code2,
  CheckCircle2,
  Cpu,
  PlusCircle,
  Copy,
  Shield,
  User,
  Lock,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { IntakeWizardModal } from '../components/intake/IntakeWizardModal';
import { AuthHeaderWidget } from '../components/auth/AuthHeaderWidget';
import { getClientsForUser, downloadClientJson, type StoredClientRecord } from '../services/clientStorage';
import { useAuth } from '../context/AuthContext';

export const WelcomePortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, signInWithGoogle } = useAuth();

  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [variationSourceSlug, setVariationSourceSlug] = useState<string | undefined>(undefined);
  const [visibleClients, setVisibleClients] = useState<StoredClientRecord[]>([]);

  const refreshClients = () => {
    setVisibleClients(getClientsForUser(user));
  };

  useEffect(() => {
    refreshClients();
  }, [user]);

  const handleStartIntake = () => {
    setVariationSourceSlug(undefined);
    setIntakeModalOpen(true);
  };

  const handleStartVariation = (slug: string) => {
    setVariationSourceSlug(slug);
    setIntakeModalOpen(true);
  };

  const handleIntakeComplete = (newSlug: string) => {
    refreshClients();
    navigate(`/${newSlug}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Platform Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <Container>
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-md">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-outfit text-lg sm:text-xl font-bold tracking-tight text-white">
                  HyperLaunch Engine
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                  {isAdmin ? 'Admin Console' : 'Welcome Portal'}
                </span>
              </div>
            </div>

            {/* Right Actions & Auth Widget */}
            <div className="flex items-center gap-3">
              <a
                href="#mockup-vault"
                className="hidden md:inline-block text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Subpages ({visibleClients.length})
              </a>

              <button
                onClick={handleStartIntake}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start Client Intake</span>
              </button>

              {/* User Google Login & Profile Widget */}
              <AuthHeaderWidget />
            </div>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-600" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <Container className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Web Architecture & Consultation Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-outfit">
            From Client Intake to Live Landing Page in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              60 Seconds
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Welcome to the client onboarding portal. Complete the structured intake questionnaire to generate an instant, full-featured client landing page mockup stored at your dedicated business subpage.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartIntake}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-indigo-600 shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Launch Client Intake Form</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#mockup-vault"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-slate-300 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 transition-colors text-sm"
            >
              <span>View Workspace Subpages</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
                {visibleClients.length}
              </span>
            </a>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google Account Claimed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Role-Gated Vault</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Variations (v1, v2)</span>
            </div>
          </div>
        </Container>
      </section>

      {/* How the Architecture Works */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 font-mono">
              The Rapid Onboarding Lifecycle
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight font-outfit">
              Engineered for Frictionless Client Consultations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Account & Intake</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Connect your Google account and complete the 5-step intake questionnaire to claim your subpage, theme palette, and core capabilities.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Subpage Engine</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Instantly mounts an authentic client landing page at <span className="font-mono text-cyan-300">/:businessname</span> with dynamic CSS variables and versioning.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Consultation & Variations</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Review live with the client using the top consultation toolbar. Create instant variations, save version snapshots, and export <span className="font-mono text-emerald-300">clientConfig.json</span>.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Role-Gated Dynamic Client Mockup Vault */}
      <section id="mockup-vault" className="py-20 border-t border-slate-900">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-indigo-400 font-mono">
                {isAdmin ? (
                  <>
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Central Oversight</span>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>Your Client Workspace</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Public Preview & Baseline Example</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-outfit mt-1">
                {isAdmin
                  ? `All Client Subpages (${visibleClients.length} Total)`
                  : isAuthenticated
                  ? `My Subpages & Baseline Example (${visibleClients.length})`
                  : 'Platform Example Mockup'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartIntake}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                <span>{isAuthenticated ? 'New Intake / Variation' : 'Start Intake'}</span>
              </button>
            </div>
          </div>

          {/* Guest Sign-In Callout */}
          {!isAuthenticated && (
            <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-semibold text-white block">
                  Want your own private business subpage?
                </span>
                <span className="text-slate-400">
                  Clients must create or connect an account with Google to claim their subpage and manage variations. Only admin accounts have visibility across all client subpages.
                </span>
              </div>
              <button
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-colors shrink-0 shadow-md"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleClients.map((client) => {
              const theme = client.config.meta.theme;
              const isOwner = user && client.ownerId === user.uid;

              return (
                <div
                  key={client.slug}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Header: Name and slug pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white tracking-tight">
                            {client.config.brand.name}
                          </h3>
                          {client.isExample && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Example
                            </span>
                          )}
                          {isOwner && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                              Yours
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-indigo-400">
                          /{client.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: theme.primaryColor }}
                          title={`Primary: ${theme.primaryColor}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: theme.accentColor }}
                          title={`Accent: ${theme.accentColor}`}
                        />
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {client.config.brand.tagline}
                    </p>

                    {/* Meta stats */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>{client.config.offerings.length} Offerings</span>
                      <span>•</span>
                      <span>Active: {client.activeVersion || 'v1'}</span>
                      {isAdmin && client.ownerEmail && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400/80 truncate max-w-[140px]">
                            {client.ownerEmail}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/${client.slug}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-indigo-400 hover:bg-indigo-300 transition-colors"
                    >
                      <span>Open Mockup</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {(isAdmin || isOwner) && (
                      <button
                        onClick={() => handleStartVariation(client.slug)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
                        title="Create a variation based on this project"
                      >
                        <Copy className="w-4 h-4 text-cyan-400" />
                      </button>
                    )}

                    <button
                      onClick={() => downloadClientJson(client.slug, client.config)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
                      title="Download JSON config"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 text-center text-xs text-slate-500">
        <Container>
          <p>© {new Date().getFullYear()} HyperLaunch Engine • Configuration-Driven Client Landing Platform</p>
        </Container>
      </footer>

      {/* Intake Wizard Modal */}
      <IntakeWizardModal
        isOpen={intakeModalOpen}
        onClose={() => setIntakeModalOpen(false)}
        onComplete={handleIntakeComplete}
        initialSourceSlug={variationSourceSlug}
      />
    </div>
  );
};

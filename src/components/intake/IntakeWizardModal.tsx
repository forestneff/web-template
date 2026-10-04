import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Palette,
  Briefcase,
  Send,
  Layers,
  ShieldCheck,
  Zap,
  Rocket,
  BarChart3,
  Users,
  Check,
  UserCheck,
  Copy,
} from 'lucide-react';
import { sanitizeSlug, saveClient, getClientsForUser, type StoredClientRecord } from '../../services/clientStorage';
import type { ClientConfig } from '../../types/config';
import { useAuth } from '../../context/AuthContext';

interface IntakeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (slug: string) => void;
  initialSourceSlug?: string;
}

const THEME_PRESETS = [
  {
    name: 'Aero Indigo (SaaS)',
    primary: '#6366f1',
    accent: '#06b6d4',
    bg: '#0f172a',
    text: '#f8fafc',
  },
  {
    name: 'Cyber Neon',
    primary: '#ec4899',
    accent: '#8b5cf6',
    bg: '#09090b',
    text: '#fafafa',
  },
  {
    name: 'Emerald Growth',
    primary: '#10b981',
    accent: '#14b8a6',
    bg: '#022c22',
    text: '#ecfdf5',
  },
  {
    name: 'Amber Ember',
    primary: '#f59e0b',
    accent: '#ef4444',
    bg: '#18181b',
    text: '#fef3c7',
  },
  {
    name: 'Modern Slate',
    primary: '#3b82f6',
    accent: '#38bdf8',
    bg: '#0b1120',
    text: '#f1f5f9',
  },
];

const AVAILABLE_ICONS = [
  { name: 'Layers', label: 'Layers', Icon: Layers },
  { name: 'Workflow', label: 'Workflow', Icon: Zap },
  { name: 'ShieldCheck', label: 'Security', Icon: ShieldCheck },
  { name: 'Rocket', label: 'Velocity', Icon: Rocket },
  { name: 'BarChart3', label: 'Analytics', Icon: BarChart3 },
  { name: 'Users', label: 'Community', Icon: Users },
];

export const IntakeWizardModal: React.FC<IntakeWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialSourceSlug,
}) => {
  const { user, isAuthenticated, signInWithGoogle, signInAsClientDemo } = useAuth();

  // If user is already authenticated, start at step 2 (Identity), else step 1 (Account Creation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Variation mode
  const [isVariation, setIsVariation] = useState<boolean>(Boolean(initialSourceSlug));
  const [existingUserPages, setExistingUserPages] = useState<StoredClientRecord[]>([]);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [tagline, setTagline] = useState('');

  // Step 3: Theme
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);
  const [primaryColor, setPrimaryColor] = useState(THEME_PRESETS[0].primary);
  const [accentColor, setAccentColor] = useState(THEME_PRESETS[0].accent);

  // Step 4: Content & Offerings
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [offerings, setOfferings] = useState([
    { title: 'Core Solution Architecture', description: 'Streamlined operational framework engineered for scale.', icon: 'Layers' },
    { title: 'Automated Lifecycle Workflows', description: 'High-speed event-driven processes that eliminate manual drag.', icon: 'Workflow' },
    { title: 'Enterprise Security & Governance', description: 'Zero-trust policies and robust observability across systems.', icon: 'ShieldCheck' },
  ]);
  const [bio, setBio] = useState('');

  // Step 5: Contact & Consultation
  const [contactType, setContactType] = useState<'calendar' | 'email' | 'form'>('calendar');
  const [calendarUrl, setCalendarUrl] = useState('https://calendar.google.com/calendar/appointments/schedules/sample');
  const [directEmail, setDirectEmail] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');

  // Load existing pages when user signs in
  useEffect(() => {
    if (user) {
      const myPages = getClientsForUser(user).filter((p) => !p.isExample);
      setExistingUserPages(myPages);
      if (!directEmail && user.email) {
        setDirectEmail(user.email);
      }
    }
  }, [user]);

  // If initial source slug is passed, load its config as variation base
  useEffect(() => {
    if (initialSourceSlug) {
      const myPages = getClientsForUser(user);
      const match = myPages.find((p) => p.slug === initialSourceSlug);
      if (match) {
        loadVariationBase(match);
      }
    }
  }, [initialSourceSlug, user]);

  const loadVariationBase = (record: StoredClientRecord) => {
    const cfg = record.config;
    setBusinessName(cfg.brand.name);
    setCustomSlug(`${record.slug}-v2`);
    setTagline(cfg.brand.tagline);
    setHeadline(cfg.hero.headline);
    setSubheadline(cfg.hero.subheadline);
    if (cfg.offerings) setOfferings(cfg.offerings);
    if (cfg.about?.bio) setBio(cfg.about.bio);
    if (cfg.meta.theme) {
      setPrimaryColor(cfg.meta.theme.primaryColor);
      setAccentColor(cfg.meta.theme.accentColor);
    }
    if (cfg.contact?.type) setContactType(cfg.contact.type);
    if (cfg.contact?.calendarEmbedUrl) setCalendarUrl(cfg.contact.calendarEmbedUrl);
    if (cfg.contact?.directEmail) setDirectEmail(cfg.contact.directEmail);
    setIsVariation(true);
  };

  if (!isOpen) return null;

  const derivedSlug = sanitizeSlug(customSlug || businessName || 'new-client');

  const handleNext = () => {
    if (currentStep === 1 && !isAuthenticated) {
      alert('Please create or connect your account with Google to continue.');
      return;
    }
    if (currentStep === 2 && !businessName.trim()) {
      alert('Please enter your business name.');
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = derivedSlug;

    const generatedConfig: ClientConfig = {
      meta: {
        siteTitle: `${businessName} | ${tagline || 'Modern Architecture'}`,
        metaDescription: subheadline || `${businessName} provides high-velocity solutions for scaling teams.`,
        theme: {
          primaryColor,
          accentColor,
          bgColor: selectedTheme.bg,
          textColor: selectedTheme.text,
        },
      },
      brand: {
        name: businessName,
        tagline: tagline || 'Engineered for high-velocity teams.',
      },
      hero: {
        headline: headline || `Accelerate Growth with ${businessName}`,
        subheadline:
          subheadline ||
          'Purpose-built infrastructure and streamlined workflows designed to maximize output and eliminate operational friction.',
        ctaText: 'Schedule Consultation',
        ctaUrl: '#contact',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      },
      offerings,
      about: {
        headline: `Engineered for High-Impact Scale`,
        bio:
          bio ||
          `At ${businessName}, we combine technical precision with strategic operational insight. Our turn-key systems bridge critical organizational gaps and empower teams to perform at peak velocity.`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        metrics: [
          { label: 'System Reliability', value: '99.9%' },
          { label: 'Pipeline Velocity', value: '3.2x' },
          { label: 'Time-to-Deploy', value: '< 10 Days' },
        ],
      },
      socialProof: [
        {
          quote: `${businessName} completely re-energized our operational stack. Execution was frictionless.`,
          author: 'Alex Henderson',
          role: 'Operations Director',
          company: 'HyperScale Labs',
        },
        {
          quote: 'The single best architectural investment we made this fiscal year. Immediate ROI.',
          author: 'Morgan Vance',
          role: 'Chief Technology Officer',
          company: 'Vertex Platform',
        },
      ],
      contact: {
        type: contactType,
        calendarEmbedUrl: calendarUrl,
        directEmail: directEmail || (user?.email ? user.email : `hello@${finalSlug}.com`),
        socialLinks: {
          ...(linkedInUrl ? { LinkedIn: linkedInUrl } : { LinkedIn: 'https://linkedin.com' }),
          Website: `https://${finalSlug}.io`,
        },
      },
    };

    saveClient(finalSlug, generatedConfig, user);
    onClose();
    onComplete(finalSlug);
  };

  const stepsList = [
    { step: 1, title: 'Account', icon: UserCheck },
    { step: 2, title: 'Identity & Slug', icon: Briefcase },
    { step: 3, title: 'Visual Theme', icon: Palette },
    { step: 4, title: 'Offerings & Pitch', icon: Layers },
    { step: 5, title: 'Consultation & Launch', icon: Send },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-white">
                Build Your Custom Landing Page
              </h2>
              <p className="text-xs text-slate-400">
                {isVariation ? 'Creating a new landing page variation' : 'Answer a few quick questions to generate your free interactive mockup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Indicator */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-900/30 flex items-center justify-between text-xs overflow-x-auto">
          {stepsList.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div
                key={item.step}
                className={`flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'text-themeAccent font-semibold'
                    : isCompleted
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive
                      ? 'bg-themeAccent text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : <IconComponent className="w-3 h-3" />}
                </div>
                <span className="hidden sm:inline">{item.title}</span>
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Account Creation & Google Sign In */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2 max-w-md mx-auto">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-white">
                  Step 1: Connect Account & Claim Your Link
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign in with Google so your custom landing page mockup is saved to your account and ready for consultation.
                </p>
              </div>

              {isAuthenticated && user ? (
                /* Authenticated State */
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          <span>{user.displayName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {user.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Ready
                    </span>
                  </div>

                  {/* Variation / Re-intake Selector if user already has pages */}
                  {existingUserPages.length > 0 && (
                    <div className="pt-3 border-t border-emerald-900/40 space-y-2">
                      <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Build from an Existing Project Variation?</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {existingUserPages.map((pg) => (
                          <button
                            type="button"
                            key={pg.slug}
                            onClick={() => loadVariationBase(pg)}
                            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 text-left transition-colors"
                          >
                            <div className="text-xs font-bold text-slate-200 truncate">
                              {pg.config.brand.name}
                            </div>
                            <div className="text-[10px] font-mono text-indigo-400">/{pg.slug}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated Sign In Card */
                <div className="max-w-md mx-auto space-y-4">
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase font-mono">
                      or instant test login
                    </span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => signInAsClientDemo()}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Continue as Demo Client (Elena Rostova)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Identity & Slug */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Velocity Labs"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-themeAccent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Subpage URL Slug (Unique Identifier)
                </label>
                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-4 py-3">
                  <span className="text-slate-500 text-sm font-mono mr-1">/</span>
                  <input
                    type="text"
                    placeholder={derivedSlug}
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="w-full bg-transparent text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Mockup will be accessible at: <span className="text-themeAccent font-mono">/{derivedSlug}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tagline / High-Concept Pitch
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous revenue engines for venture-backed enterprise SaaS."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-themeAccent"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Visual Theme */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Select Visual Aesthetic Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_PRESETS.map((p) => {
                    const isSelected = selectedTheme.name === p.name;
                    return (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => {
                          setSelectedTheme(p);
                          setPrimaryColor(p.primary);
                          setAccentColor(p.accent);
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-themeAccent bg-slate-900/90 shadow-md ring-1 ring-themeAccent'
                            : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-200">{p.name}</div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/30"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/30"
                              style={{ backgroundColor: p.accent }}
                            />
                            <span className="text-[10px] text-slate-500 font-mono">
                              {p.primary}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-themeAccent" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Overrides */}
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-4">
                <div className="text-xs font-semibold text-slate-300">Custom Brand Tokens</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Offerings & Pitch */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  placeholder={`Scale Revenue Engine Velocity for ${businessName || 'SaaS'}`}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-themeAccent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hero Subheadline
                </label>
                <input
                  type="text"
                  placeholder="Purpose-built infrastructure and workflows engineered for maximum output."
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-themeAccent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Core Offerings (3 Services)
                </label>
                <div className="space-y-3">
                  {offerings.map((offering, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-themeAccent font-bold">0{idx + 1}</span>
                        <input
                          type="text"
                          value={offering.title}
                          onChange={(e) => {
                            const copy = [...offerings];
                            copy[idx].title = e.target.value;
                            setOfferings(copy);
                          }}
                          placeholder="Offering Title"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-themeAccent"
                        />
                        <select
                          value={offering.icon}
                          onChange={(e) => {
                            const copy = [...offerings];
                            copy[idx].icon = e.target.value;
                            setOfferings(copy);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                        >
                          {AVAILABLE_ICONS.map((ic) => (
                            <option key={ic.name} value={ic.name}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={offering.description}
                        onChange={(e) => {
                          const copy = [...offerings];
                          copy[idx].description = e.target.value;
                          setOfferings(copy);
                        }}
                        placeholder="Short description of this service"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Company Bio (About)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A brief overview of your founding team, mission, or track record..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-themeAccent resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Consultation & Launch */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Call to Action / Consultation Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'calendar' as const, label: 'Calendar Booking' },
                    { type: 'email' as const, label: 'Direct Email' },
                    { type: 'form' as const, label: 'Inquiry Form' },
                  ].map((ct) => (
                    <button
                      key={ct.type}
                      type="button"
                      onClick={() => setContactType(ct.type)}
                      className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                        contactType === ct.type
                          ? 'border-themeAccent bg-themeAccent/10 text-themeAccent font-bold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {contactType === 'calendar' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Calendar Embed / Scheduling Link
                  </label>
                  <input
                    type="url"
                    value={calendarUrl}
                    onChange={(e) => setCalendarUrl(e.target.value)}
                    placeholder="https://calendly.com/your-team"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-themeAccent"
                  />
                </div>
              )}

              {contactType === 'email' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Direct Contact Email
                  </label>
                  <input
                    type="email"
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    placeholder="consult@yourbusiness.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-themeAccent"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  LinkedIn or Social Profile (Optional)
                </label>
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://linkedin.com/company/yourbusiness"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-themeAccent"
                />
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 text-xs space-y-1">
                <span className="font-semibold block">⚡ Subpage Generation & Owner Claim</span>
                <span>
                  This mockup will be registered to{' '}
                  <span className="font-semibold text-white">{user?.email || 'your account'}</span> at{' '}
                  <span className="font-mono text-themeAccent">/{derivedSlug}</span>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-themeAccent hover:opacity-90 transition-opacity"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-themePrimary hover:bg-themePrimary/90 transition-all shadow-lg shadow-themePrimary/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Mockup Subpage</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

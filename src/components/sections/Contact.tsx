import React, { useState } from 'react';
import { Calendar, Mail, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { DynamicIcon } from '../ui/DynamicIcon';
import type { ContactConfig } from '../../types/config';

interface ContactProps {
  data?: ContactConfig;
  brandName?: string;
}

export const Contact: React.FC<ContactProps> = ({ data, brandName }) => {
  if (!data) {
    return null;
  }

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-800/80 bg-slate-950/60 relative">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full opacity-15 blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--primary-color) 0%, var(--accent-color) 50%, transparent 80%)`,
        }}
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="text-xs uppercase font-bold tracking-widest text-themeAccent font-mono">
              Ready to Accelerate?
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-themeText tracking-tight">
              Initiate Your Advisory Consultation
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Connect directly with our engineering team to review your current tech stack, pipeline bottlenecks, and implementation roadmap.
            </p>
          </div>

          {/* Main Branching Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Branch 1: Calendar */}
            {data.type === 'calendar' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-themePrimary/20 text-themeAccent border border-themePrimary/30">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">
                        Schedule Architecture Review
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400">
                        30-minute high-impact deep dive with a senior RevOps architect.
                      </p>
                    </div>
                  </div>
                  {data.calendarEmbedUrl && (
                    <a
                      href={data.calendarEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-themePrimary hover:bg-themePrimary/90 transition-all shadow-md shadow-themePrimary/20 text-sm"
                    >
                      <span>Open in Calendar</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Calendar Interactive Simulation / Frame */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Booking Schedule Connected
                  </div>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Direct calendar synchronization active for {brandName || 'our engineering desk'}. Select an available executive slot or launch external scheduling.
                  </p>
                  <div className="pt-2">
                    <a
                      href={data.calendarEmbedUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-themeAccent hover:opacity-90 transition-opacity text-sm shadow-lg shadow-themeAccent/20"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Select Preferred Slot (30 Mins)</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Branch 2: Email */}
            {data.type === 'email' && (
              <div className="text-center py-8 space-y-6">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-themePrimary/20 border border-themePrimary/30 text-themeAccent flex items-center justify-center">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-100">Direct Inquiries</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    We maintain an SLA of under 4 hours for all incoming enterprise evaluation requests.
                  </p>
                </div>
                {data.directEmail && (
                  <div>
                    <a
                      href={`mailto:${data.directEmail}`}
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white bg-themePrimary hover:bg-themePrimary/90 transition-all text-base shadow-xl shadow-themePrimary/30"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email: {data.directEmail}</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Branch 3: Form */}
            {data.type === 'form' && (
              <div>
                {formSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">Message Received</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                      Thank you for reaching out. A systems engineer will respond within 4 business hours.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-themeAccent hover:underline"
                    >
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Elena Vance"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-themeAccent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Work Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="elena@company.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-themeAccent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Project Scope or Message
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your pipeline bottlenecks or current data stack..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-themeAccent resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-themePrimary hover:bg-themePrimary/90 transition-all text-sm shadow-lg shadow-themePrimary/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Request</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Direct Email fallback & Social profiles */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              {data.directEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-themeAccent" />
                  <span>Direct: </span>
                  <a
                    href={`mailto:${data.directEmail}`}
                    className="text-slate-300 hover:text-themeAccent transition-colors underline"
                  >
                    {data.directEmail}
                  </a>
                </div>
              )}

              {data.socialLinks && Object.keys(data.socialLinks).length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">Channels:</span>
                  {Object.entries(data.socialLinks).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-themeAccent transition-colors flex items-center gap-1"
                    >
                      <DynamicIcon name={name.toLowerCase().includes('git') ? 'Github' : name.toLowerCase().includes('link') ? 'Linkedin' : 'Share2'} className="w-3.5 h-3.5" />
                      <span>{name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

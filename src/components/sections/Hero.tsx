import React from 'react';
import { ArrowRight, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';
import { Container } from '../ui/Container';
import type { HeroConfig } from '../../types/config';

interface HeroProps {
  data: HeroConfig;
  brandTagline?: string;
}

export const Hero: React.FC<HeroProps> = ({ data, brandTagline }) => {
  if (!data || !data.headline) {
    return null;
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Radial Glow using CSS Variables */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--accent-color) 0%, var(--primary-color) 50%, transparent 80%)`,
        }}
      />
      
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline / Pill Badge */}
            {brandTagline && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-themeAccent/30 bg-themeAccent/10 text-themeAccent text-xs sm:text-sm font-medium tracking-wide shadow-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{brandTagline}</span>
              </div>
            )}

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-themeText leading-[1.12]">
              {data.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {data.subheadline}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={data.ctaUrl || '#contact'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-themePrimary shadow-xl shadow-themePrimary/30 hover:bg-themePrimary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{data.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#offerings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <span>Explore Capabilities</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-themeAccent" />
                <span>Zero Lock-in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-themeAccent" />
                <span>Instant Configuration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-themeAccent" />
                <span>Production Ready</span>
              </div>
            </div>
          </div>

          {/* Right Media / Graphic Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glow backdrop behind media */}
              <div
                className="absolute -inset-1.5 rounded-3xl opacity-30 blur-xl filter transition duration-1000 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(to right, var(--primary-color), var(--accent-color))`,
                }}
              />

              <div className="relative rounded-2xl border border-slate-700/70 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 tracking-wider">
                    live.telemetry.orchestration
                  </div>
                  <div className="w-4" />
                </div>

                {/* Media Image or Visual Mockup */}
                {data.mediaUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={data.mediaUrl}
                      alt="Operations Dashboard"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-200">Continuous Pipeline Active</span>
                      </div>
                      <span className="text-[11px] font-mono text-themeAccent font-semibold">99.8% SLA</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 space-y-4">
                    <div className="h-6 w-32 rounded bg-slate-800 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-slate-800/60" />
                      <div className="h-4 w-5/6 rounded bg-slate-800/60" />
                    </div>
                    <div className="h-28 rounded-xl bg-gradient-to-br from-themePrimary/20 to-themeAccent/20 border border-themeAccent/30 flex items-center justify-center">
                      <span className="text-xs font-mono text-themeAccent">Dynamic Pipeline Engine</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

import React from 'react';
import { Container } from '../ui/Container';
import { Award, Zap } from 'lucide-react';
import type { AboutConfig } from '../../types/config';

interface AboutProps {
  data?: AboutConfig;
}

export const About: React.FC<AboutProps> = ({ data }) => {
  if (!data || !data.headline) {
    return null;
  }

  const hasMetrics = Array.isArray(data.metrics) && data.metrics.length > 0;

  return (
    <section id="about" className="py-20 border-t border-slate-800/80 bg-slate-950/40 relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Avatar / Visual Card */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm">
              <div
                className="absolute -inset-1 rounded-2xl opacity-20 blur-lg"
                style={{
                  background: `linear-gradient(135deg, var(--primary-color), var(--accent-color))`,
                }}
              />
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-xl">
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt="Leadership avatar"
                    className="w-full h-80 object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-80 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-500">
                    <Award className="w-16 h-16 text-themeAccent/50" />
                  </div>
                )}

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-themeAccent">
                      Leadership & Vision
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      Technical Operations Group
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-themePrimary/20 text-themeAccent border border-themePrimary/30">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="text-xs uppercase font-bold tracking-widest text-themeAccent font-mono">
              About the Company
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-themeText tracking-tight leading-snug">
              {data.headline}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {data.bio}
            </p>

            {/* Metrics Counters (Resilient: cleanly renders only when metrics exist) */}
            {hasMetrics && (
              <div className="pt-6 border-t border-slate-800/80">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {data.metrics!.map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-themeAccent">
                        {metric.value}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

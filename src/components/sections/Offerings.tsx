import React from 'react';
import { Container } from '../ui/Container';
import { DynamicIcon } from '../ui/DynamicIcon';
import type { OfferingsConfig } from '../../types/config';

interface OfferingsProps {
  data?: OfferingsConfig;
}

export const Offerings: React.FC<OfferingsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section id="offerings" className="py-20 border-t border-slate-800/80 relative">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-widest text-themeAccent font-mono">
            Core Architecture & Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-themeText tracking-tight">
            Engineered for Modern Revenue & Operations Infrastructure
          </p>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate operational drag with purpose-built systems tailored for scalable go-to-market teams.
          </p>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((offering, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-themeAccent/40 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-themePrimary/10 flex flex-col justify-between"
            >
              {/* Subtle card glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-themePrimary/5 via-transparent to-themeAccent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                {/* Icon Badge */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-themePrimary/15 border border-themePrimary/30 text-themeAccent shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <DynamicIcon name={offering.icon} className="h-6 w-6" />
                </div>

                {/* Offering Title */}
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-themeAccent transition-colors">
                  {offering.title}
                </h3>

                {/* Offering Description */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {offering.description}
                </p>
              </div>

              {/* Bottom detail pill */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Phase 0{idx + 1}</span>
                <span className="text-themeAccent opacity-0 group-hover:opacity-100 transition-opacity">
                  Active Spec →
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

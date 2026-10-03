import React from 'react';
import { Container } from '../ui/Container';
import { Quote, Star } from 'lucide-react';
import type { SocialProofConfig } from '../../types/config';

interface SocialProofProps {
  data?: SocialProofConfig;
}

export const SocialProof: React.FC<SocialProofProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section id="social-proof" className="py-20 border-t border-slate-800/80 relative">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs uppercase font-bold tracking-widest text-themeAccent font-mono">
            Verified Partner Results
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-themeText tracking-tight">
            Validated by Venture-Backed Leaders
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            See how high-growth teams achieve breakout operational efficiency with our unified pipeline architecture.
          </p>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-themeAccent/40 hover:bg-slate-900/80 flex flex-col justify-between"
            >
              {/* Quote icon watermarked */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-700/60" />
              </div>

              {/* Quote Body */}
              <p className="text-slate-300 text-base sm:text-lg italic leading-relaxed mb-6 font-normal">
                "{item.quote}"
              </p>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-100 text-sm">
                    {item.author}
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.role} {item.company ? `• ${item.company}` : ''}
                  </div>
                </div>
                <div className="h-7 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 flex items-center">
                  Verified Result
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

import React, { useState } from 'react';
import { Settings, X, RotateCcw, AlertTriangle, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface JsonConfigDevDrawerProps {
  rawJson: string;
  onUpdateJson: (newJson: string) => boolean;
  onReset: () => void;
  validationErrors: string[];
  isValid: boolean;
}

export const JsonConfigDevDrawer: React.FC<JsonConfigDevDrawerProps> = ({
  rawJson,
  onUpdateJson,
  onReset,
  validationErrors,
  isValid,
}) => {
  // Only mount/render in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localText, setLocalText] = useState(rawJson);

  // Keep localText synced when rawJson updates from outside (like reset)
  React.useEffect(() => {
    setLocalText(rawJson);
  }, [rawJson]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalText(val);
    onUpdateJson(val);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(localText);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalText(formatted);
      onUpdateJson(formatted);
    } catch {
      // ignore if invalid syntax
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const handlePreset = (themeName: 'cyber' | 'emerald' | 'amber') => {
    try {
      const parsed = JSON.parse(localText);
      if (themeName === 'cyber') {
        parsed.meta.theme.primaryColor = '#ec4899';
        parsed.meta.theme.accentColor = '#8b5cf6';
        parsed.meta.theme.bgColor = '#09090b';
        parsed.meta.theme.textColor = '#fafafa';
      } else if (themeName === 'emerald') {
        parsed.meta.theme.primaryColor = '#10b981';
        parsed.meta.theme.accentColor = '#14b8a6';
        parsed.meta.theme.bgColor = '#022c22';
        parsed.meta.theme.textColor = '#ecfdf5';
      } else if (themeName === 'amber') {
        parsed.meta.theme.primaryColor = '#f59e0b';
        parsed.meta.theme.accentColor = '#ef4444';
        parsed.meta.theme.bgColor = '#18181b';
        parsed.meta.theme.textColor = '#fef3c7';
      }
      const updated = JSON.stringify(parsed, null, 2);
      setLocalText(updated);
      onUpdateJson(updated);
    } catch (e) {
      console.warn('Unable to apply theme preset:', e);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold shadow-2xl transition-all duration-300',
          'bg-slate-900/90 text-white border border-slate-700/80 backdrop-blur-md hover:bg-slate-800 hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-themeAccent'
        )}
        title="Open Dynamic Config Dev Drawer"
        aria-label="Open Configuration Dev Drawer"
      >
        <Settings className="w-4 h-4 animate-spin-slow text-themeAccent" />
        <span className="hidden sm:inline">Config Drawer</span>
        <span
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            isValid ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
          )}
        />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full sm:w-[540px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Client Config Engine
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded bg-slate-800 text-slate-400 border border-slate-700">
                  DEV
                </span>
              </h2>
              <p className="text-xs text-slate-400">Real-time schema testing & live re-theming</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Status Bar */}
        <div
          className={cn(
            'px-6 py-2.5 text-xs flex items-center justify-between border-b',
            isValid
              ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-900/50 text-rose-300'
          )}
        >
          <div className="flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Valid Configuration (Zod Verified)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium">
                  {validationErrors.length} Issue{validationErrors.length > 1 ? 's' : ''} Detected
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFormat}
              className="text-[11px] underline underline-offset-2 hover:text-white transition-colors"
            >
              Format
            </button>
            <span>•</span>
            <button
              onClick={handleCopy}
              className="text-[11px] flex items-center gap-1 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Error Details Box */}
        {validationErrors.length > 0 && (
          <div className="max-h-36 overflow-y-auto px-6 py-3 bg-rose-950/20 border-b border-rose-900/40 text-xs text-rose-300 space-y-1 font-mono">
            {validationErrors.map((err, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-rose-500">•</span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        {/* Palette Quick-Switchers */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/30 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          <button
            onClick={() => handlePreset('cyber')}
            className="px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 transition-colors text-[11px]"
          >
            Neon Cyber
          </button>
          <button
            onClick={() => handlePreset('emerald')}
            className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors text-[11px]"
          >
            Emerald SaaS
          </button>
          <button
            onClick={() => handlePreset('amber')}
            className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors text-[11px]"
          >
            Amber Ember
          </button>
        </div>

        {/* Text Area for Live JSON */}
        <div className="flex-1 p-4 flex flex-col min-h-0 bg-slate-950">
          <label htmlFor="config-json-editor" className="sr-only">
            Configuration JSON Editor
          </label>
          <textarea
            id="config-json-editor"
            value={localText}
            onChange={handleTextChange}
            spellCheck={false}
            className="flex-1 w-full p-4 font-mono text-xs leading-relaxed bg-slate-900/80 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-themeAccent resize-none selection:bg-indigo-500/30"
            placeholder="Paste or modify clientConfig.json here..."
          />
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-themeAccent rounded-lg hover:opacity-90 transition-opacity"
          >
            Close & Preview
          </button>
        </div>
      </aside>
    </>
  );
};

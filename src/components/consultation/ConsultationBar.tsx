import React, { useState } from 'react';
import {
  Download,
  Sliders,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Copy,
  History,
  Check,
} from 'lucide-react';
import {
  downloadClientJson,
  saveNewVersion,
  switchActiveVersion,
  createVariation,
  type StoredClientRecord,
} from '../../services/clientStorage';
import type { ClientConfig } from '../../types/config';
import { useAuth } from '../../context/AuthContext';

interface ConsultationBarProps {
  slug: string;
  config: ClientConfig;
  record?: StoredClientRecord | null;
  onOpenDrawer: () => void;
  onBackToPortal: () => void;
  onConfigReload?: (newConfig: ClientConfig) => void;
  onVariationCreated?: (newSlug: string) => void;
}

export const ConsultationBar: React.FC<ConsultationBarProps> = ({
  slug,
  config,
  record,
  onOpenDrawer,
  onBackToPortal,
  onConfigReload,
  onVariationCreated,
}) => {
  const { user, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const versions = record?.versions || { v1: config };
  const activeVersion = record?.activeVersion || 'v1';

  const handleDownload = () => {
    downloadClientJson(slug, config);
  };

  const handleSaveSnapshotVersion = () => {
    const nextVerIndex = Object.keys(versions).length + 1;
    const nextVerTag = `v${nextVerIndex}`;
    const updated = saveNewVersion(slug, nextVerTag, config);
    if (updated && onConfigReload) {
      onConfigReload(config);
    }
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleSelectVersion = (tag: string) => {
    const updated = switchActiveVersion(slug, tag);
    if (updated && onConfigReload) {
      onConfigReload(updated.config);
    }
    setVersionDropdownOpen(false);
  };

  const handleCreateVariation = () => {
    const variationSlug = `${slug}-v${Object.keys(versions).length + 1}`;
    const newRecord = createVariation(slug, variationSlug, user);
    if (newRecord && onVariationCreated) {
      onVariationCreated(variationSlug);
    } else {
      window.location.href = `/${variationSlug}`;
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Collapsed Pill State: Always keeps Back to Portal accessible */}
      {isCollapsed ? (
        <div className="flex items-center justify-between p-2 px-4 bg-transparent pointer-events-none">
          <button
            onClick={onBackToPortal}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/95 text-indigo-300 hover:text-white border border-indigo-500/40 shadow-xl backdrop-blur-md hover:bg-indigo-600 text-xs font-semibold transition-all hover:scale-105"
            title="Return to Welcome Landing Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Portal</span>
          </button>

          <button
            onClick={() => setIsCollapsed(false)}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md hover:bg-slate-800 text-xs font-semibold"
            title="Expand Consultation Toolbar"
          >
            <Sparkles className="w-3.5 h-3.5 text-themeAccent" />
            <span>Consultation Tools ({activeVersion})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      ) : (
        /* Expanded Full Consultation Bar */
        <div className="bg-slate-950/95 border-b border-indigo-500/30 px-4 py-2.5 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Prominent Back to Portal & Client Slug Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Return to Welcome Landing Portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="font-semibold text-slate-200">{config.brand.name}</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px]">
                /{slug}
              </span>
              {record?.ownerEmail && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                  Owner: {record.ownerEmail}
                </span>
              )}
              {isAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Access
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Version Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setVersionDropdownOpen(!versionDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Manage page versions"
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono">{activeVersion}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {versionDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setVersionDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 text-xs space-y-1">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500">
                      Saved Versions
                    </div>
                    {Object.keys(versions).map((vKey) => (
                      <button
                        key={vKey}
                        onClick={() => handleSelectVersion(vKey)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                          activeVersion === vKey
                            ? 'bg-indigo-950/60 text-indigo-300 font-semibold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <span className="font-mono">{vKey}</span>
                        {activeVersion === vKey && <Check className="w-3 h-3 text-indigo-400" />}
                      </button>
                    ))}
                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={handleSaveSnapshotVersion}
                        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/30 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Save as Next Version</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Create Variation Button */}
            <button
              onClick={handleCreateVariation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Duplicate this page to a new variation subpage"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Clone Variation</span>
            </button>

            {/* Download JSON */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium transition-colors"
              title="Download clientConfig.json for deployment or engineering handover"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {/* Live Editor */}
            <button
              onClick={onOpenDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
              title="Open Live Schema Editor"
            >
              <Sliders className="w-3.5 h-3.5 text-themeAccent" />
              <span>Edit Tokens</span>
            </button>

            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
              title="Minimize bar for clean client presentation"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {copiedNotification && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-900/90 text-emerald-200 border border-emerald-500/40 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>New version snapshot saved!</span>
        </div>
      )}
    </div>
  );
};

import type { ClientConfig } from '../types/config';
import baselineConfig from '../config/clientConfig.json';
import type { AuthUser } from '../context/AuthContext';

const STORAGE_KEY = 'web_builder_clients_v2';

export interface StoredClientRecord {
  slug: string;
  config: ClientConfig;
  ownerId?: string;
  ownerEmail?: string;
  isExample?: boolean;
  createdAt: string;
  updatedAt: string;
  versions?: Record<string, ClientConfig>;
  activeVersion?: string;
}

export function sanitizeSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'client-site'
  );
}

function getInitialStore(): Record<string, StoredClientRecord> {
  const defaultSlug = 'aeroscalesolutions';
  const now = new Date().toISOString();
  return {
    [defaultSlug]: {
      slug: defaultSlug,
      config: baselineConfig as unknown as ClientConfig,
      isExample: true,
      ownerEmail: 'demo@aeroscalesolutions.io',
      ownerId: 'system-demo',
      createdAt: now,
      updatedAt: now,
      activeVersion: 'v1',
      versions: {
        v1: baselineConfig as unknown as ClientConfig,
      },
    },
  };
}

export function getAllClients(): Record<string, StoredClientRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialStore();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('[clientStorage] Failed to read from localStorage:', e);
    return getInitialStore();
  }
}

export function getClientBySlug(slug: string): StoredClientRecord | null {
  const store = getAllClients();
  const normalized = sanitizeSlug(slug);
  return store[normalized] || null;
}

/**
 * Returns subpages based on permissions:
 * - Admin: sees all client mockups
 * - Client: sees their own mockups + generic example page
 * - Unauthenticated: sees only the generic example page
 */
export function getClientsForUser(user: AuthUser | null): StoredClientRecord[] {
  const all = Object.values(getAllClients());

  if (!user) {
    return all.filter((r) => r.isExample || r.slug === 'aeroscalesolutions');
  }

  if (user.role === 'admin') {
    return all;
  }

  // Client role: see generic example + their own created pages
  return all.filter(
    (r) =>
      r.isExample ||
      r.slug === 'aeroscalesolutions' ||
      r.ownerId === user.uid ||
      (user.email && r.ownerEmail?.toLowerCase() === user.email.toLowerCase())
  );
}

export function saveClient(
  slug: string,
  config: ClientConfig,
  user?: AuthUser | null
): StoredClientRecord {
  const store = getAllClients();
  const normalized = sanitizeSlug(slug);
  const now = new Date().toISOString();
  const existing = store[normalized];

  const currentVersions = existing?.versions || { v1: config };
  const activeVer = existing?.activeVersion || 'v1';
  currentVersions[activeVer] = config;

  const record: StoredClientRecord = {
    slug: normalized,
    config,
    ownerId: existing ? existing.ownerId : user?.uid || undefined,
    ownerEmail: existing ? existing.ownerEmail : user?.email || undefined,
    isExample: normalized === 'aeroscalesolutions',
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
    versions: currentVersions,
    activeVersion: activeVer,
  };

  store[normalized] = record;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('[clientStorage] Failed to save client to localStorage:', e);
  }

  return record;
}

export function createVariation(
  baseSlug: string,
  newSlug: string,
  user?: AuthUser | null,
  overrideConfig?: Partial<ClientConfig>
): StoredClientRecord | null {
  const base = getClientBySlug(baseSlug);
  if (!base) return null;

  const clonedConfig: ClientConfig = JSON.parse(JSON.stringify(base.config));
  if (overrideConfig) {
    Object.assign(clonedConfig, overrideConfig);
  }

  return saveClient(newSlug, clonedConfig, user);
}

export function saveNewVersion(
  slug: string,
  versionTag: string,
  config: ClientConfig
): StoredClientRecord | null {
  const store = getAllClients();
  const normalized = sanitizeSlug(slug);
  const record = store[normalized];
  if (!record) return null;

  const versions = record.versions || {};
  versions[versionTag] = config;

  record.versions = versions;
  record.activeVersion = versionTag;
  record.config = config;
  record.updatedAt = new Date().toISOString();

  store[normalized] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  return record;
}

export function switchActiveVersion(
  slug: string,
  versionTag: string
): StoredClientRecord | null {
  const store = getAllClients();
  const normalized = sanitizeSlug(slug);
  const record = store[normalized];
  if (!record || !record.versions || !record.versions[versionTag]) return null;

  record.activeVersion = versionTag;
  record.config = record.versions[versionTag];
  record.updatedAt = new Date().toISOString();

  store[normalized] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  return record;
}

export function deleteClient(slug: string): boolean {
  const store = getAllClients();
  const normalized = sanitizeSlug(slug);
  if (store[normalized]) {
    delete store[normalized];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  }
  return false;
}

export function downloadClientJson(slug: string, config: ClientConfig): void {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${sanitizeSlug(slug)}-clientConfig.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

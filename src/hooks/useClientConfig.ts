import { useState, useEffect, useMemo, useCallback } from 'react';
import { clientConfigSchema } from '../config/schema';
import type { ClientConfig } from '../types/config';
import defaultRawConfig from '../config/clientConfig.json';

export interface UseClientConfigReturn {
  config: ClientConfig;
  rawJsonString: string;
  updateRawJson: (jsonString: string) => boolean;
  resetToDefault: () => void;
  validationErrors: string[];
  isValid: boolean;
}

export function useClientConfig(initialConfig: unknown = defaultRawConfig): UseClientConfigReturn {
  const [rawJsonString, setRawJsonString] = useState<string>(() =>
    JSON.stringify(initialConfig, null, 2)
  );

  const [lastValidConfig, setLastValidConfig] = useState<ClientConfig>(() => {
    const parseResult = clientConfigSchema.safeParse(initialConfig);
    if (parseResult.success) {
      return parseResult.data;
    }
    console.error('[useClientConfig] Initial configuration validation failed:', parseResult.error);
    // Return empty safe baseline if initial fails
    return {
      meta: {
        siteTitle: 'Modular Client Engine',
        metaDescription: 'Config-driven landing page',
        theme: {
          primaryColor: '#6366f1',
          accentColor: '#06b6d4',
          bgColor: '#0f172a',
          textColor: '#f8fafc',
        },
      },
      brand: {
        name: 'Brand Name',
        tagline: 'Empowering your growth with modern architecture.',
      },
      hero: {
        headline: 'Modern Client Landing Engine',
        subheadline: 'Driven dynamically by typed JSON configurations.',
        ctaText: 'Get Started',
        ctaUrl: '#contact',
      },
      offerings: [],
    };
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(true);

  // Update theme tokens and head tags whenever valid config changes
  useEffect(() => {
    const { meta } = lastValidConfig;
    const root = document.documentElement;

    if (meta?.theme) {
      if (meta.theme.primaryColor) {
        root.style.setProperty('--primary-color', meta.theme.primaryColor);
      }
      if (meta.theme.accentColor) {
        root.style.setProperty('--accent-color', meta.theme.accentColor);
      }
      if (meta.theme.bgColor) {
        root.style.setProperty('--bg-color', meta.theme.bgColor);
      }
      if (meta.theme.textColor) {
        root.style.setProperty('--text-color', meta.theme.textColor);
      }
    }

    if (meta?.siteTitle) {
      document.title = meta.siteTitle;
    }

    if (meta?.metaDescription) {
      let metaDescEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!metaDescEl) {
        metaDescEl = document.createElement('meta');
        metaDescEl.name = 'description';
        document.head.appendChild(metaDescEl);
      }
      metaDescEl.content = meta.metaDescription;
    }
  }, [lastValidConfig]);

  const updateRawJson = useCallback((newJsonStr: string): boolean => {
    setRawJsonString(newJsonStr);

    let parsedObj: unknown;
    try {
      parsedObj = JSON.parse(newJsonStr);
    } catch (syntaxErr) {
      const msg = syntaxErr instanceof Error ? syntaxErr.message : 'Invalid JSON syntax';
      setValidationErrors([`Syntax Error: ${msg}`]);
      setIsValid(false);
      console.warn('[useClientConfig] Syntax parsing error:', msg);
      return false;
    }

    const validationResult = clientConfigSchema.safeParse(parsedObj);
    if (validationResult.success) {
      setLastValidConfig(validationResult.data);
      setValidationErrors([]);
      setIsValid(true);
      return true;
    } else {
      const formattedErrors = validationResult.error.issues.map(
        (issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`
      );
      setValidationErrors(formattedErrors);
      setIsValid(false);
      console.warn('[useClientConfig] Zod schema validation errors:', formattedErrors);
      return false;
    }
  }, []);

  const resetToDefault = useCallback(() => {
    const defaultStr = JSON.stringify(defaultRawConfig, null, 2);
    setRawJsonString(defaultStr);
    const parsed = clientConfigSchema.parse(defaultRawConfig);
    setLastValidConfig(parsed);
    setValidationErrors([]);
    setIsValid(true);
  }, []);

  return useMemo(
    () => ({
      config: lastValidConfig,
      rawJsonString,
      updateRawJson,
      resetToDefault,
      validationErrors,
      isValid,
    }),
    [lastValidConfig, rawJsonString, updateRawJson, resetToDefault, validationErrors, isValid]
  );
}

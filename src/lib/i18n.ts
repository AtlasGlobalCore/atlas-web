import { useCallback } from 'react';
import { useAtlasStore, type Locale } from '@/lib/store';
import en from '@/i18n/locales/en';
import fr from '@/i18n/locales/fr';
import ptPT from '@/i18n/locales/pt-PT';
import ptBR from '@/i18n/locales/pt-BR';

const translations: Record<Locale, typeof en> = {
  en,
  fr,
  'pt-PT': ptPT,
  'pt-BR': ptBR,
};

// Deep nested key access: t('wallet.loginTab') → translations[locale].wallet.loginTab
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const { locale } = useAtlasStore();

  const t = useCallback(
    (key: string, replacements?: Record<string, string | number>): string => {
      const dict = translations[locale] || translations.en;
      let value = getNestedValue(dict as unknown as Record<string, unknown>, key);
      // Fallback to English if key not found
      if (value === key && locale !== 'en') {
        value = getNestedValue(translations.en as unknown as Record<string, unknown>, key);
      }
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale]
  );

  return { t, locale };
}

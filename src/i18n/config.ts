export const locales = ['en', 'fr', 'pt-PT', 'pt-BR'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  'pt-PT': 'Português (Europe)',
  'pt-BR': 'Português (Brasil)',
}

export const localeFlags: Record<Locale, string> = {
  en: 'GB',
  fr: 'FR',
  'pt-PT': 'PT',
  'pt-BR': 'BR',
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

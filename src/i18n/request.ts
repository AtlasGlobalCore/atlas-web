import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'fr', 'pt-PT', 'pt-BR'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locales.includes(locale as Locale) ? locale : 'en'
  return {
    messages: (await import(`@/messages/${validLocale}.json`)).default,
  }
})

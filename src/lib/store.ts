import { create } from 'zustand'

export type Page = 'landing' | 'command' | 'studio' | 'legal' | 'prices' | 'services'
export type LegalTab = 'structure' | 'terms-of-service' | 'privacy-policy' | 'compliance-manifesto' | 'refund-policy'
export type Locale = 'en' | 'fr' | 'pt-PT' | 'pt-BR'

interface AtlasState {
  currentPage: Page
  kybCompleted: boolean
  sidebarOpen: boolean
  selectedLegalTab: LegalTab
  locale: Locale
  setPage: (page: Page) => void
  setKybCompleted: (val: boolean) => void
  setSidebarOpen: (val: boolean) => void
  setSelectedLegalTab: (tab: LegalTab) => void
  setLocale: (locale: Locale) => void
  navigateToLegal: (tab: LegalTab) => void
}

export const useAtlasStore = create<AtlasState>((set) => ({
  currentPage: 'landing',
  kybCompleted: false,
  sidebarOpen: true,
  selectedLegalTab: 'structure' as LegalTab,
  locale: 'en' as Locale,
  setPage: (page) => set({ currentPage: page }),
  setKybCompleted: (val) => set({ kybCompleted: val }),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  setSelectedLegalTab: (tab) => set({ selectedLegalTab: tab }),
  setLocale: (locale) => set({ locale }),
  navigateToLegal: (tab) => set({ currentPage: 'legal', selectedLegalTab: tab }),
}))

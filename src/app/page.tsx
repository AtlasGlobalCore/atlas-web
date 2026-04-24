'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAtlasStore } from '@/lib/store'
import { Navbar } from '@/components/atlas/navbar'
import { Footer } from '@/components/atlas/footer'
import { LandingPage } from '@/components/atlas/landing-page'
import { CommandHub } from '@/components/atlas/command-hub'
import { StudioBuilder } from '@/components/atlas/studio-builder'
import { LegalHub } from '@/components/atlas/legal-hub'
import { PricingPage } from '@/components/atlas/pricing-page'
import { ServicesPage } from '@/components/atlas/services-page'
import { DashboardShell } from '@/components/wallet/dashboard-shell'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export default function Home() {
  const { currentPage } = useAtlasStore()

  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1 pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {currentPage === 'landing' && <LandingPage />}
            {currentPage === 'command' && <CommandHub />}
            {currentPage === 'studio' && <StudioBuilder />}
            {currentPage === 'legal' && <LegalHub />}
            {currentPage === 'prices' && <PricingPage />}
            {currentPage === 'services' && <ServicesPage />}
            {currentPage === 'wallet' && <DashboardShell />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

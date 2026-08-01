import { lazy } from 'react'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BottomNav from '../components/BottomNav'
import ErrorBoundary from '../components/ErrorBoundary'
import LazySection from '../components/LazySection'

import Hero from '../sections/Hero'
import BiografiaSection from '../sections/BiografiaSection'
import LiveSection from '../sections/LiveSection'
import type { ContentItem } from '../types'

const EpisodesSection = lazy(() => import('../sections/EpisodesSection'))
const MomentsFeed = lazy(() => import('../sections/MomentsFeed'))
const PodcastsSection = lazy(() => import('../sections/PodcastsSection'))
const VlogSection = lazy(() => import('../sections/VlogSection'))
const MusicRadioSection = lazy(() => import('../sections/MusicRadioSection'))
const ShopSection = lazy(() => import('../sections/ShopSection'))
const PremiumSection = lazy(() => import('../sections/PremiumSection'))
const TipsSection = lazy(() => import('../sections/TipsSection'))
const GameSection = lazy(() => import('../sections/GameSection'))
const CommunitySection = lazy(() => import('../sections/CommunitySection'))
const ContactSection = lazy(() => import('../sections/ContactSection'))

interface HomePageProps {
  activeSection: string
  setActiveSection: (section: string) => void
  allContent: ContentItem[]
  handleVideoSelect: (video: ContentItem) => void
  openSignUp: () => void
  scrollTo: (id: string) => void
}

export default function HomePage({
  activeSection,
  setActiveSection,
  allContent,
  handleVideoSelect,
  openSignUp,
  scrollTo,
}: HomePageProps) {
  return (
    <>
      <SEO path="/" />
      <div className="bg-obsidian-400 min-h-screen">
        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          allContent={allContent}
        />

        <main className="pb-20 md:pb-0">
          <ErrorBoundary>
            <Hero
              onWatchLive={() => scrollTo('live')}
              onExplore={() => scrollTo('episodes')}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <BiografiaSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <LiveSection onVideoSelect={handleVideoSelect} />
          </ErrorBoundary>
          <LazySection>
            <EpisodesSection onVideoSelect={handleVideoSelect} />
          </LazySection>
          <LazySection>
            <MomentsFeed onVideoSelect={handleVideoSelect} />
          </LazySection>
          <LazySection>
            <PodcastsSection onVideoSelect={handleVideoSelect} />
          </LazySection>
          <LazySection>
            <VlogSection onVideoSelect={handleVideoSelect} />
          </LazySection>
          <LazySection>
            <MusicRadioSection onVideoSelect={handleVideoSelect} />
          </LazySection>
          <LazySection>
            <ShopSection />
          </LazySection>
          <LazySection>
            <PremiumSection onJoinCircle={openSignUp} />
          </LazySection>
          <LazySection>
            <TipsSection />
          </LazySection>
          <LazySection minHeight={600}>
            <GameSection />
          </LazySection>
          <LazySection>
            <CommunitySection onJoinCircle={openSignUp} />
          </LazySection>
          <LazySection>
            <ContactSection />
          </LazySection>
        </main>

        <Footer />
        <BottomNav />
      </div>
    </>
  )
}

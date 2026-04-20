'use client'

import { useRef, useState } from 'react'
import ContactCta from '@/components/shared/contact-cta'
import {
  featuredCases,
  featuredProducts,
  featuredSolutions,
  heroMetrics,
  homeStoryMoments,
  homeValuePoints,
  productCategories
} from '@/lib/site-data'
import { useHomeIntroMotion } from '@/components/pages/home/hooks/use-home-intro-motion'
import { useHomeStoryMotion } from '@/components/pages/home/hooks/use-home-story-motion'
import { useScrollRevealMotion } from '@/components/pages/home/hooks/use-scroll-reveal-motion'
import CategoriesSection from '@/components/pages/home/sections/categories-section'
import FeaturedCasesSection from '@/components/pages/home/sections/featured-cases-section'
import FeaturedProductsSection from '@/components/pages/home/sections/featured-products-section'
import FeaturedSolutionsSection from '@/components/pages/home/sections/featured-solutions-section'
import HeroSection from '@/components/pages/home/sections/hero-section'
import StorySection from '@/components/pages/home/sections/story-section'
import ValueSection from '@/components/pages/home/sections/value-section'

export default function HomePage() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const pageRef = useRef(null)

  useHomeIntroMotion(pageRef)
  useScrollRevealMotion(pageRef)
  useHomeStoryMotion({ pageRef, setActiveStoryIndex })

  return (
    <div ref={pageRef}>
      <HeroSection heroMetrics={heroMetrics} />
      <StorySection
        activeStoryIndex={activeStoryIndex}
        storyMoments={homeStoryMoments}
      />
      <ValueSection points={homeValuePoints} />
      <CategoriesSection categories={productCategories} />
      <FeaturedProductsSection products={featuredProducts} />
      <FeaturedSolutionsSection solutions={featuredSolutions} />
      <FeaturedCasesSection cases={featuredCases} />
      <ContactCta />
    </div>
  )
}

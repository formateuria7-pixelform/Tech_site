import React from 'react';
import { Seo } from '../components/Seo';
import { Hero } from '../components/home/Hero';
import { StatsBand } from '../components/home/StatsBand';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { PopularProducts } from '../components/home/PopularProducts';
import { ProcessSection } from '../components/home/ProcessSection';
import { RealisationsPreview } from '../components/home/RealisationsPreview';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { PartnersMarquee } from '../components/home/PartnersMarquee';
import { NewsPreview } from '../components/home/NewsPreview';
import { CtaMapSection } from '../components/home/CtaMapSection';

export function Home() {
  return (
    <>
      <Seo
        title="Installation électronique, sécurité et informatique à Lyon"
        description="OHMEGA installe, équipe et maintient vos systèmes électroniques, de sécurité et informatiques. Devis gratuit sous 48 h, boutique de matériel professionnel, maintenance et assistance."
        image="/df51d3cd-f622-403d-a9db-407b925f5a68.jpg" />
      
      <Hero />
      <StatsBand />
      <ServicesGrid />
      <PopularProducts />
      <ProcessSection />
      <RealisationsPreview />
      <TestimonialsSection />
      <PartnersMarquee />
      <NewsPreview />
      <CtaMapSection />
    </>);

}
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { processSteps } from '../../data/content';

export function ProcessSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="bg-ink py-20 lg:py-28" aria-labelledby="process-title">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
        <SectionHeading
          eyebrow="Méthode"
          title={<span id="process-title">Comment se déroule une intervention</span>}
          intro="Un déroulé identique pour chaque dossier, du premier appel au suivi post-installation." />
        

        <div ref={ref} className="relative mt-16 pl-8 sm:pl-12">
          <div className="absolute left-[7px] top-2 h-full w-px bg-paper/12 sm:left-[15px]" aria-hidden="true" />
          <motion.div
            style={{ height }}
            className="absolute left-[7px] top-2 w-px bg-volt sm:left-[15px]"
            aria-hidden="true" />
          
          <ol className="space-y-12">
            {processSteps.map((step, i) =>
            <Reveal as="li" key={step.step} delay={i * 0.05} className="relative">
                <span
                className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-volt bg-ink sm:-left-12"
                aria-hidden="true">
                
                  <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-volt sm:w-16">{step.step}</span>
                  <div className="max-w-2xl">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fog">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            )}
          </ol>
        </div>
      </div>
    </section>);

}
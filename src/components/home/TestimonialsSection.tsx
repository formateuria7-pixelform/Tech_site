import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuoteIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { testimonials } from '../../data/content';
import { cx } from '../../lib/format';

export function TestimonialsSection() {
  const [index, setIndex] = React.useState(0);
  const active = testimonials[index];

  const go = (dir: 1 | -1) =>
  setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="bg-ink py-20 lg:py-28" aria-labelledby="temoignages-title">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
        <SectionHeading
          eyebrow="Témoignages"
          title={<span id="temoignages-title">Ce que disent nos clients</span>} />
        

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="relative min-h-[280px]">
            <QuoteIcon className="h-10 w-10 text-volt" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.author}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6">
                
                <p className="font-display text-2xl font-medium leading-[1.3] tracking-tight text-paper sm:text-3xl lg:text-[2.5rem]">
                  « {active.quote} »
                </p>
                <footer className="mt-8">
                  <p className="text-sm font-medium text-paper">{active.author}</p>
                  <p className="mt-1 text-sm text-fog">
                    {active.role} — {active.company}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-volt">
                    {active.service}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Témoignage précédent"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-volt hover:text-volt">
                
                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Témoignage suivant"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-volt hover:text-volt">
                
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="ml-3 font-mono text-[11px] text-fog">
                {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-2 lg:border-l lg:border-paper/10 lg:pl-8">
            {testimonials.map((t, i) =>
            <li key={t.author}>
                <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={cx(
                  'w-full rounded-xl px-4 py-4 text-left transition-colors',
                  i === index ? 'bg-coal text-paper' : 'text-fog hover:bg-coal/60 hover:text-paper'
                )}>
                
                  <span className="block text-sm font-medium">{t.author}</span>
                  <span className="mt-0.5 block text-xs">{t.company}</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}
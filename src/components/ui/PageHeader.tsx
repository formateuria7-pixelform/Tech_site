import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type Crumb = {label: string;to?: string;};

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children






}: {eyebrow?: string;title: string;intro?: string;crumbs?: Crumb[];children?: React.ReactNode;}) {
  return (
    <section className="noise relative overflow-hidden border-b border-paper/10 bg-coal">
      <div className="grid-tech absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-14 sm:px-6 lg:py-20 xl:px-10">
        {crumbs.length > 0 &&
        <nav aria-label="Fil d’Ariane" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
              <li>
                <Link to="/" className="hover:text-volt">
                  Accueil
                </Link>
              </li>
              {crumbs.map((c) =>
            <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
                  {c.to ?
              <Link to={c.to} className="hover:text-volt">
                      {c.label}
                    </Link> :

              <span className="text-paper">{c.label}</span>
              }
                </li>
            )}
            </ol>
          </nav>
        }

        {eyebrow &&
        <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-volt" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-volt">{eyebrow}</span>
          </div>
        }

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-paper sm:text-5xl lg:text-6xl">
          
          {title}
        </motion.h1>

        {intro &&
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-fog sm:text-lg">
          
            {intro}
          </motion.p>
        }

        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>);

}
import React from 'react';
import { Reveal } from '../ui/Reveal';
import { Counter } from '../ui/Counter';
import { stats } from '../../data/content';

export function StatsBand() {
  return (
    <section className="border-y border-paper/10 bg-coal" aria-label="Chiffres clés">
      <div className="mx-auto grid max-w-[1400px] gap-px bg-paper/10 px-0 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) =>
        <Reveal key={s.label} delay={i * 0.08} className="bg-coal">
            <div className="px-6 py-10 lg:px-10 lg:py-14">
              <p className="font-display text-4xl font-semibold tracking-tightest text-volt lg:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-4 text-sm font-medium text-paper">{s.label}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">{s.detail}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>);

}
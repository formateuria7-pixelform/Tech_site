import React from 'react';
import { partners } from '../../data/content';

export function PartnersMarquee() {
  const loop = [...partners, ...partners];
  return (
    <section className="border-y border-paper/10 bg-coal py-10" aria-label="Marques partenaires">
      <p className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-fog">
        Marques et partenaires distribués
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-14 px-7 motion-reduce:animate-none">
          {loop.map((p, i) =>
          <li
            key={`${p}-${i}`}
            className="font-display text-xl font-semibold tracking-tight text-paper/35 transition-colors hover:text-paper"
            aria-hidden={i >= partners.length}>
            
              {p}
            </li>
          )}
        </ul>
      </div>
    </section>);

}
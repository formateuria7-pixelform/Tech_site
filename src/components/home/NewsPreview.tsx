import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { formatDate } from '../../lib/format';

export function NewsPreview() {
  const journal = useStore((s) => s.journal);
  const latest = [...journal].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <section className="bg-ink py-20 lg:py-28" aria-labelledby="actus-title">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
        <SectionHeading
          eyebrow="Actualités"
          title={<span id="actus-title">Conseils techniques et veille</span>}
          intro="Nos retours d’expérience terrain, sans jargon commercial."
          action={
          <ButtonLink to="/actualites" variant="outline">
              Tous les articles
            </ButtonLink>
          } />
        

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {latest.map((post, i) =>
          <Reveal as="li" key={post.slug} delay={i * 0.07}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-paper/10 bg-coal transition-colors hover:border-paper/25">
                <Link to={`/actualites/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-steel">
                  <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-volt">
                    <span>{post.category}</span>
                    <span className="text-fog">{post.readingTime} min</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-paper">
                    <Link to={`/actualites/${post.slug}`} className="hover:text-volt">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-fog">{post.excerpt}</p>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                    {formatDate(post.date)}
                  </p>
                </div>
              </article>
            </Reveal>
          )}
        </ul>
      </div>
    </section>);

}
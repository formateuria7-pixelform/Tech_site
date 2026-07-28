import React from 'react';
import { Reveal } from './Reveal';
import { cx } from '../../lib/format';

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
  level?: 1 | 2 | 3;
  action?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  className,
  level = 2,
  action
}: Props) {
  const Tag = `h${level}` as unknown as 'h2';
  return (
    <div
      className={cx(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center text-center',
        className
      )}>
      
      <Reveal className="max-w-2xl">
        {eyebrow &&
        <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-volt" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-volt">{eyebrow}</span>
          </div>
        }
        <Tag className="font-display text-3xl font-semibold leading-[1.05] tracking-tightest text-paper sm:text-4xl lg:text-[3.25rem]">
          {title}
        </Tag>
        {intro && <p className="mt-5 text-base leading-relaxed text-fog">{intro}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>);

}
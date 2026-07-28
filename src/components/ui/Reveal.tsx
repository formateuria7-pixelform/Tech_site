import React from 'react';
import { motion, useInView } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
};

/** Apparition douce au défilement, jouée une seule fois. */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Tag = motion[as];

  return (
    <Tag
      ref={ref as never}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      
      {children}
    </Tag>);

}
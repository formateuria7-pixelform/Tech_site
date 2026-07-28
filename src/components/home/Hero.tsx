import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, ShieldCheckIcon, ZapIcon, CalendarCheckIcon } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { company } from '../../data/content';

const HERO_IMAGE = "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg";

const highlights = [
{ icon: ZapIcon, label: 'Prise en charge sous 2 h ouvrées' },
{ icon: ShieldCheckIcon, label: 'Installations conformes et documentées' },
{ icon: CalendarCheckIcon, label: 'Créneaux d’intervention garantis' }];


export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section ref={ref} className="noise relative overflow-hidden bg-ink" aria-labelledby="hero-title">
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10">
        <img
          src={HERO_IMAGE}
          alt="Technicien OHMEGA installant une baie réseau dans un local technique"
          className="h-[120%] w-full object-cover" />
        
      </motion.div>
      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 -z-10 bg-ink"
        aria-hidden="true" />
      
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0B0C0E_10%,transparent_65%)]"
        aria-hidden="true" />
      
      <div className="grid-tech absolute inset-0 -z-10 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-20 sm:px-6 lg:pb-24 lg:pt-32 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3">
          
          <span className="h-px w-10 bg-volt" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-volt">
            Lyon · depuis {company.since}
          </span>
        </motion.div>

        <h1
          id="hero-title"
          className="mt-7 max-w-[19ch] font-display text-[clamp(2.6rem,8vw,6.5rem)] font-semibold leading-[0.94] tracking-tightest text-paper">
          
          {['Électronique,', 'sécurité et', 'informatique'].map((line, i) =>
          <motion.span
            key={line}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            className="block">
            
              {line}
            </motion.span>
          )}
          <motion.span
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="block text-volt">
            
            installées comme il faut.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
          
          Installation, vente de matériel, maintenance et assistance technique pour les entreprises,
          les collectivités et les particuliers. Un interlocuteur unique, des délais tenus, des
          dossiers techniques complets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.44 }}
          className="mt-10 flex flex-wrap items-center gap-3">
          
          <ButtonLink to="/devis" size="lg" className="group">
            Demander un devis gratuit
            <ArrowRightIcon
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true" />
            
          </ButtonLink>
          <ButtonLink to="/rendez-vous" size="lg" variant="outline">
            Prendre rendez-vous
          </ButtonLink>
          <Link
            to="/boutique"
            className="ml-1 inline-flex h-14 items-center px-2 text-sm text-paper/70 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-volt hover:decoration-volt">
            
            Voir la boutique
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-paper/12 bg-paper/12 sm:grid-cols-3">
          
          {highlights.map(({ icon: Icon, label }) =>
          <li key={label} className="flex items-center gap-3 bg-ink/80 p-5 backdrop-blur-sm">
              <Icon className="h-5 w-5 shrink-0 text-volt" aria-hidden="true" />
              <span className="text-sm text-paper/85">{label}</span>
            </li>
          )}
        </motion.ul>
      </div>
    </section>);

}
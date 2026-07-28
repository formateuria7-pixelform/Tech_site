import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MenuIcon,
  XIcon,
  ShoppingBagIcon,
  UserIcon,
  SearchIcon,
  HeartIcon,
  PhoneIcon,
  LayoutDashboardIcon,
  LogOutIcon } from
'lucide-react';
import { useCartDetails, useCurrentUser, useStore } from '../../store/useStore';
import { company } from '../../data/content';
import { services } from '../../data/services';
import { cx } from '../../lib/format';
import { SearchOverlay } from '../SearchOverlay';

const nav = [
{ to: '/services', label: 'Services' },
{ to: '/boutique', label: 'Boutique' },
{ to: '/realisations', label: 'Réalisations' },
{ to: '/actualites', label: 'Actualités' },
{ to: '/a-propos', label: 'À propos' },
{ to: '/contact', label: 'Contact' }];


export function Header() {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const { count } = useCartDetails();
  const favorites = useStore((s) => s.favorites);
  const user = useCurrentUser();
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-volt focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-ink">
        
        Aller au contenu principal
      </a>

      <div className="hidden border-b border-paper/8 bg-ink lg:block">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fog xl:px-10">
          <span>Installation · Sécurité · Informatique · Maintenance — Lyon &amp; région</span>
          <div className="flex items-center gap-6">
            <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-volt">
              <PhoneIcon className="h-3 w-3" aria-hidden="true" />
              {company.phone}
            </a>
            <Link to="/devis" className="text-volt hover:underline">
              Devis gratuit 48 h
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cx(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled ? 'border-paper/10 bg-ink/85 backdrop-blur-xl' : 'border-transparent bg-ink'
        )}>
        
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-5 sm:px-6 xl:px-10">
          <Link to="/" className="group flex items-center gap-3" aria-label={`${company.name} — accueil`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt font-display text-xl font-bold text-ink transition-transform duration-300 group-hover:rotate-6">
              Ω
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-paper">{company.name}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-fog">Solutions techniques</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="ml-6 hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}>
              
              <NavLink
                to="/services"
                className={({ isActive }) =>
                cx(
                  'flex h-10 items-center rounded-full px-4 text-sm transition-colors',
                  isActive ? 'text-volt' : 'text-paper/75 hover:text-paper'
                )
                }>
                
                Services
              </NavLink>
              <AnimatePresence>
                {servicesOpen &&
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-11 w-[420px] overflow-hidden rounded-2xl border border-paper/10 bg-coal p-2 shadow-2xl shadow-black/60">
                  
                    {services.map((s) =>
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-paper/5">
                    
                        <span className="font-mono text-[11px] text-volt">{s.index}</span>
                        <span>
                          <span className="block text-sm font-medium text-paper">{s.name}</span>
                          <span className="mt-0.5 block text-xs text-fog">{s.tagline}</span>
                        </span>
                      </Link>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
            {nav.slice(1).map((item) =>
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
              cx(
                'flex h-10 items-center rounded-full px-4 text-sm transition-colors',
                isActive ? 'text-volt' : 'text-paper/75 hover:text-paper'
              )
              }>
              
                {item.label}
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-paper/75 transition-colors hover:bg-paper/5 hover:text-paper"
              aria-label="Rechercher un produit ou un service">
              
              <SearchIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>

            <Link
              to="/compte/favoris"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-paper/75 transition-colors hover:bg-paper/5 hover:text-paper sm:flex"
              aria-label={`Favoris (${favorites.length})`}>
              
              <HeartIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              {favorites.length > 0 &&
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-volt" aria-hidden="true" />
              }
            </Link>

            <Link
              to="/panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-paper/75 transition-colors hover:bg-paper/5 hover:text-paper"
              aria-label={`Panier — ${count} article${count > 1 ? 's' : ''}`}>
              
              <ShoppingBagIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              {count > 0 &&
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-volt px-1 font-mono text-[10px] font-semibold text-ink">
                  {count}
                </span>
              }
            </Link>

            {user ?
            <div className="flex items-center gap-1">
                <Link
                to={user.role === 'admin' ? '/admin' : '/compte'}
                className="flex h-10 items-center gap-2 rounded-full border border-paper/15 px-3 text-sm text-paper transition-colors hover:border-volt hover:text-volt">
                
                  {user.role === 'admin' ?
                <LayoutDashboardIcon className="h-4 w-4" aria-hidden="true" /> :

                <UserIcon className="h-4 w-4" aria-hidden="true" />
                }
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Link>
                <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
                aria-label="Se déconnecter">
                
                  <LogOutIcon className="h-[17px] w-[17px]" aria-hidden="true" />
                </button>
              </div> :

            <Link
              to="/connexion"
              className="hidden h-10 items-center gap-2 rounded-full border border-paper/15 px-4 text-sm text-paper transition-colors hover:border-volt hover:text-volt sm:flex">
              
                <UserIcon className="h-4 w-4" aria-hidden="true" />
                Connexion
              </Link>
            }

            <Link
              to="/devis"
              className="ml-1 hidden h-10 items-center rounded-full bg-volt px-5 text-sm font-medium text-ink transition-colors hover:bg-[#d8ff6d] xl:flex">
              
              Demander un devis
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-paper lg:hidden"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}>
              
              {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open &&
          <motion.nav
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Navigation mobile"
            className="overflow-hidden border-t border-paper/10 bg-ink lg:hidden">
            
              <div className="flex flex-col gap-1 px-5 py-5">
                {nav.map((item) =>
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                cx(
                  'flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg',
                  isActive ? 'bg-paper/5 text-volt' : 'text-paper'
                )
                }>
                
                    {item.label}
                  </NavLink>
              )}
                <div className="my-3 h-px bg-paper/10" />
                <Link
                to="/rendez-vous"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-paper/80">
                
                  Prendre rendez-vous
                </Link>
                <Link to="/faq" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-paper/80">
                  FAQ
                </Link>
                <Link
                to={user ? user.role === 'admin' ? '/admin' : '/compte' : '/connexion'}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-paper/80">
                
                  {user ? 'Mon espace' : 'Connexion / Inscription'}
                </Link>
                <Link
                to="/devis"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-12 items-center justify-center rounded-full bg-volt font-medium text-ink">
                
                  Demander un devis
                </Link>
              </div>
            </motion.nav>
          }
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>);

}
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogInIcon, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { useStore } from '../store/useStore';

export function Login() {
  const login = useStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password);
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? 'Connexion impossible.');
      return;
    }
    const isAdmin = email.trim().toLowerCase() === 'admin@ohmega-solutions.fr';
    toast.success('Connexion réussie');
    navigate(isAdmin ? '/admin' : '/compte');
  };

  return (
    <>
      <Seo title="Connexion" description="Accédez à votre espace client OHMEGA : devis, commandes, rendez-vous et documents." />
      <PageHeader eyebrow="Espace client" title="Connexion" crumbs={[{ label: 'Connexion' }]} />

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto grid max-w-4xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.2fr_1fr] xl:px-10">
          <form onSubmit={submit} className="rounded-3xl border border-paper/10 bg-coal p-7 lg:p-9" noValidate>
            <h2 className="font-display text-xl font-semibold tracking-tight text-paper">
              Accéder à mon espace
            </h2>
            <div className="mt-6 space-y-5">
              <Field label="Adresse e-mail" htmlFor="login-email" required>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
                
              </Field>
              <Field label="Mot de passe" htmlFor="login-password" required error={error ?? undefined}>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  invalid={!!error}
                  required />
                
              </Field>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-fog">
                <input type="checkbox" className="h-4 w-4 rounded accent-volt" defaultChecked />
                Rester connecté
              </label>
              <Link to="/mot-de-passe-oublie" className="text-xs text-volt hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" size="lg" className="mt-7 w-full" disabled={pending}>
              <LogInIcon className="h-4 w-4" aria-hidden="true" />
              {pending ? 'Connexion…' : 'Se connecter'}
            </Button>

            <p className="mt-6 text-center text-sm text-fog">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-volt hover:underline">
                Créer un compte
              </Link>
            </p>
          </form>

          <aside className="rounded-3xl border border-paper/10 bg-coal p-7">
            <div className="flex items-start gap-3">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Comptes de démonstration</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fog">
              Cette plateforme fonctionne avec des comptes locaux. Utilisez l’un des accès ci-dessous pour
              explorer l’espace client ou l’administration.
            </p>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="rounded-xl border border-paper/10 bg-ink p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Client</dt>
                <dd className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('claire.delmas@exemple.fr');
                      setPassword('Client!2026');
                    }}
                    className="block font-mono text-xs text-paper hover:text-volt">
                    
                    claire.delmas@exemple.fr
                  </button>
                  <span className="block font-mono text-xs text-fog">Client!2026</span>
                </dd>
              </div>
              <div className="rounded-xl border border-volt/25 bg-volt/5 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt">Administrateur</dt>
                <dd className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@ohmega-solutions.fr');
                      setPassword('Ohmega!2026');
                    }}
                    className="block font-mono text-xs text-paper hover:text-volt">
                    
                    admin@ohmega-solutions.fr
                  </button>
                  <span className="block font-mono text-xs text-fog">Ohmega!2026</span>
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-fog">
              Cliquez sur une adresse pour pré-remplir le formulaire.
            </p>
          </aside>
        </div>
      </section>
    </>);

}
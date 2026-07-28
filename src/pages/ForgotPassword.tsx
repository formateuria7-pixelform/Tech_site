import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheckIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button, ButtonLink } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { useStore } from '../store/useStore';

export function ForgotPassword() {
  const requestReset = useStore((s) => s.requestPasswordReset);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = requestReset(email);
    if (!result.ok) {
      setError(result.error ?? 'Demande impossible.');
      return;
    }
    setError(null);
    setSent(true);
    toast.success('Lien de réinitialisation envoyé');
  };

  return (
    <>
      <Seo title="Mot de passe oublié" description="Recevez un lien sécurisé pour réinitialiser votre mot de passe." />
      <PageHeader
        eyebrow="Espace client"
        title="Réinitialiser le mot de passe"
        crumbs={[{ label: 'Connexion', to: '/connexion' }, { label: 'Mot de passe oublié' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-lg px-5 sm:px-6 xl:px-10">
          {sent ?
          <div className="rounded-3xl border border-volt/25 bg-coal p-8">
              <MailCheckIcon className="h-9 w-9 text-volt" aria-hidden="true" />
              <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-paper">
                Vérifiez votre boîte de réception
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Un lien de réinitialisation a été envoyé à <span className="text-paper">{email}</span>. Il est
                valable 30 minutes et utilisable une seule fois.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to="/connexion">Retour à la connexion</ButtonLink>
                <Button variant="ghost" onClick={() => setSent(false)}>
                  Renvoyer le lien
                </Button>
              </div>
            </div> :

          <form onSubmit={submit} className="rounded-3xl border border-paper/10 bg-coal p-7 lg:p-9" noValidate>
              <p className="text-sm leading-relaxed text-fog">
                Saisissez l’adresse e-mail associée à votre compte. Nous vous enverrons un lien sécurisé pour
                définir un nouveau mot de passe.
              </p>
              <div className="mt-6">
                <Field label="Adresse e-mail" htmlFor="fp-email" required error={error ?? undefined}>
                  <Input
                  id="fp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={!!error}
                  required />
                
                </Field>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full">
                <SendIcon className="h-4 w-4" aria-hidden="true" />
                Envoyer le lien
              </Button>
              <p className="mt-6 text-center text-sm text-fog">
                <Link to="/connexion" className="text-volt hover:underline">
                  Revenir à la connexion
                </Link>
              </p>
            </form>
          }
        </div>
      </section>
    </>);

}
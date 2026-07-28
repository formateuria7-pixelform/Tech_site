import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PaperclipIcon, XIcon, FileTextIcon, CheckCircle2Icon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button, ButtonLink } from '../components/ui/Button';
import { Field, Input, Textarea, Select } from '../components/ui/Field';
import { services } from '../data/services';
import { useCurrentUser, useStore, type Quote } from '../store/useStore';
import { downloadQuote } from '../lib/documents';
import { cx } from '../lib/format';

const schema = z.object({
  serviceSlug: z.string().min(1, 'Sélectionnez une prestation'),
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(9, 'Numéro invalide'),
  company: z.string().optional(),
  address: z.string().min(5, 'Adresse d’intervention requise'),
  description: z.string().min(30, 'Décrivez le besoin en 30 caractères minimum'),
  urgency: z.enum(['normale', 'prioritaire', 'urgente']),
  budget: z.string().min(1, 'Sélectionnez une fourchette'),
  acceptPrivacy: z.literal(true, { errorMap: () => ({ message: 'Consentement requis' }) })
});

type FormValues = z.infer<typeof schema>;

const budgets = [
'Moins de 1 000 €',
'1 000 € — 5 000 €',
'5 000 € — 15 000 €',
'15 000 € — 50 000 €',
'Plus de 50 000 €',
'À déterminer avec vous'];


const urgencies = [
{ key: 'normale', label: 'Normale', detail: 'Réponse sous 48 h ouvrées' },
{ key: 'prioritaire', label: 'Prioritaire', detail: 'Réponse sous 24 h ouvrées' },
{ key: 'urgente', label: 'Urgente', detail: 'Rappel sous 2 h ouvrées' }] as
const;

export function QuoteRequest() {
  const [params] = useSearchParams();
  const user = useCurrentUser();
  const createQuote = useStore((s) => s.createQuote);
  const navigate = useNavigate();
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [created, setCreated] = React.useState<Quote | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const preselected = params.get('service') ?? params.get('produit') ?? '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceSlug: services.some((s) => s.slug === preselected) ? preselected : services[0].slug,
      name: user ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      company: user?.company ?? '',
      address: user ? `${user.address.line1}, ${user.address.postalCode} ${user.address.city}` : '',
      description: params.get('produit') ? `Installation du matériel : ${params.get('produit')}. ` : '',
      urgency: 'normale',
      budget: budgets[1]
    }
  });

  const urgency = watch('urgency');

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).map((f) => f.name);
    setAttachments((prev) => [...prev, ...files].slice(0, 6));
    e.target.value = '';
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const service = services.find((s) => s.slug === values.serviceSlug)!;
    const quote = createQuote({
      serviceSlug: values.serviceSlug,
      serviceName: service.name,
      contact: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company || undefined
      },
      address: values.address,
      description: values.description,
      urgency: values.urgency,
      budget: values.budget,
      attachments
    });
    setSubmitting(false);
    setCreated(quote);
    toast.success('Demande envoyée', { description: `Référence ${quote.ref}` });
  };

  if (created) {
    return (
      <>
        <Seo title="Demande de devis envoyée" description="Votre demande de devis est enregistrée." />
        <PageHeader
          eyebrow="Devis"
          title="Votre demande est enregistrée"
          crumbs={[{ label: 'Devis', to: '/devis' }, { label: created.ref }]} />
        
        <section className="bg-ink py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 xl:px-10">
            <div className="rounded-3xl border border-volt/25 bg-coal p-8 lg:p-10">
              <CheckCircle2Icon className="h-9 w-9 text-volt" aria-hidden="true" />
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-paper">
                Référence {created.ref}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Un accusé de réception vous a été envoyé à {created.contact.email}. Un technicien qualifie
                votre demande{' '}
                {created.urgency === 'urgente' ? 'sous 2 heures ouvrées' : 'sous 48 heures ouvrées'} et revient
                vers vous avec le devis chiffré.
              </p>

              <dl className="mt-8 grid gap-5 border-t border-paper/10 pt-7 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Prestation</dt>
                  <dd className="mt-1 text-sm text-paper">{created.serviceName}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Urgence</dt>
                  <dd className="mt-1 text-sm text-paper">{created.urgency}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Lieu</dt>
                  <dd className="mt-1 text-sm text-paper">{created.address}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Budget indiqué</dt>
                  <dd className="mt-1 text-sm text-paper">{created.budget}</dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-wrap gap-3 border-t border-paper/10 pt-8">
                <Button
                  onClick={() => {
                    const ok = downloadQuote(created);
                    if (!ok) toast.error('Autorisez les fenêtres surgissantes pour générer le PDF.');
                  }}>
                  
                  <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                  Télécharger le récapitulatif
                </Button>
                <ButtonLink to="/compte/devis" variant="outline">
                  Suivre mes devis
                </ButtonLink>
                <Button variant="ghost" onClick={() => navigate('/rendez-vous')}>
                  Réserver un créneau
                </Button>
              </div>

              {!user &&
              <p className="mt-7 rounded-xl bg-ink/60 p-4 text-xs leading-relaxed text-fog">
                  Vous n’êtes pas connecté :{' '}
                  <Link to="/inscription" className="text-volt underline">
                    créez un compte
                  </Link>{' '}
                  avec cette adresse e-mail pour retrouver ce devis et suivre son avancement.
                </p>
              }
            </div>
          </div>
        </section>
      </>);

  }

  return (
    <>
      <Seo
        title="Demander un devis gratuit"
        description="Formulaire de demande de devis : prestation, description, photos, adresse, urgence et budget. Réponse sous 48 heures ouvrées." />
      
      <PageHeader
        eyebrow="Devis gratuit"
        title="Décrivez votre besoin"
        intro="Plus votre description est précise, plus le chiffrage sera juste. Vous pouvez joindre photos, plans ou cahier des charges."
        crumbs={[{ label: 'Devis' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-14 xl:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                Prestation concernée
              </legend>
              <div className="mt-5 grid gap-5">
                <Field label="Service" htmlFor="serviceSlug" required error={errors.serviceSlug?.message}>
                  <Select id="serviceSlug" invalid={!!errors.serviceSlug} {...register('serviceSlug')}>
                    {services.map((s) =>
                    <option key={s.slug} value={s.slug}>
                        {s.name} — {s.tagline}
                      </option>
                    )}
                  </Select>
                </Field>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                    Niveau d’urgence <span className="text-volt">*</span>
                  </span>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                    {urgencies.map((u) =>
                    <li key={u.key}>
                        <label
                        className={cx(
                          'flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-colors',
                          urgency === u.key ? 'border-volt bg-volt/8' : 'border-paper/12 hover:border-paper/30'
                        )}>
                        
                          <span className="flex items-center gap-2">
                            <input type="radio" value={u.key} className="h-4 w-4 accent-volt" {...register('urgency')} />
                            <span className="text-sm font-medium text-paper">{u.label}</span>
                          </span>
                          <span className="ml-6 text-xs text-fog">{u.detail}</span>
                        </label>
                      </li>
                    )}
                  </ul>
                </div>

                <Field label="Budget envisagé" htmlFor="budget" required error={errors.budget?.message}>
                  <Select id="budget" invalid={!!errors.budget} {...register('budget')}>
                    {budgets.map((b) =>
                    <option key={b} value={b}>
                        {b}
                      </option>
                    )}
                  </Select>
                </Field>
              </div>
            </fieldset>

            <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                Description du besoin
              </legend>
              <div className="mt-5 space-y-5">
                <Field
                  label="Décrivez le projet"
                  htmlFor="description"
                  required
                  error={errors.description?.message}
                  hint="Surface, nombre d’équipements, contraintes d’accès, délais souhaités…">
                  
                  <Textarea
                    id="description"
                    rows={7}
                    invalid={!!errors.description}
                    placeholder="Ex. : 14 caméras extérieures sur un site de 3 000 m², local technique existant, intervention hors horaires d’ouverture…"
                    {...register('description')} />
                  
                </Field>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                    Photos et documents
                  </span>
                  <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-paper/20 px-4 py-5 transition-colors hover:border-volt">
                    <PaperclipIcon className="h-5 w-5 text-volt" aria-hidden="true" />
                    <span className="text-sm text-fog">
                      Joindre des fichiers (photos, plans, PDF) — 6 maximum
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={onFiles}
                      className="sr-only" />
                    
                  </label>
                  {attachments.length > 0 &&
                  <ul className="mt-3 space-y-2">
                      {attachments.map((a, i) =>
                    <li
                      key={`${a}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-paper/10 bg-ink px-4 py-2.5">
                      
                          <FileTextIcon className="h-4 w-4 shrink-0 text-fog" aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate text-sm text-paper">{a}</span>
                          <button
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label={`Retirer ${a}`}
                        className="text-fog hover:text-red-300">
                        
                            <XIcon className="h-4 w-4" />
                          </button>
                        </li>
                    )}
                    </ul>
                  }
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                Vos coordonnées
              </legend>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" invalid={!!errors.name} {...register('name')} />
                </Field>
                <Field label="Société (optionnel)" htmlFor="company">
                  <Input id="company" {...register('company')} />
                </Field>
                <Field label="E-mail" htmlFor="email" required error={errors.email?.message}>
                  <Input id="email" type="email" invalid={!!errors.email} {...register('email')} />
                </Field>
                <Field label="Téléphone" htmlFor="phone" required error={errors.phone?.message}>
                  <Input id="phone" type="tel" invalid={!!errors.phone} {...register('phone')} />
                </Field>
                <Field
                  label="Adresse d’intervention"
                  htmlFor="address"
                  required
                  error={errors.address?.message}
                  className="sm:col-span-2">
                  
                  <Input id="address" invalid={!!errors.address} {...register('address')} />
                </Field>
              </div>

              <div className="mt-6">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-fog">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-volt" {...register('acceptPrivacy')} />
                  <span>
                    J’accepte que mes données soient utilisées pour traiter ma demande, conformément à la{' '}
                    <Link to="/confidentialite" className="text-volt underline">
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
                {errors.acceptPrivacy &&
                <p role="alert" className="mt-2 text-xs text-red-400">
                    {errors.acceptPrivacy.message}
                  </p>
                }
              </div>

              <Button type="submit" size="lg" className="mt-7 w-full sm:w-auto" disabled={submitting}>
                {submitting ? 'Envoi en cours…' : 'Envoyer ma demande de devis'}
              </Button>
            </fieldset>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Ce qui se passe ensuite</h2>
              <ol className="mt-6 space-y-5">
                {[
                ['01', 'Qualification', 'Un technicien relit votre demande et vous appelle si besoin de précisions.'],
                ['02', 'Visite si nécessaire', 'Pour les chantiers complexes, un relevé sur site est planifié.'],
                ['03', 'Devis détaillé', 'Chiffrage ligne par ligne, sans poste flou, valable 30 jours.'],
                ['04', 'Suivi', 'Statut consultable dans votre espace client, avec historique des échanges.']].
                map(([n, title, text]) =>
                <li key={n} className="flex gap-4">
                    <span className="font-mono text-[11px] text-volt">{n}</span>
                    <span>
                      <span className="block text-sm font-medium text-paper">{title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-fog">{text}</span>
                    </span>
                  </li>
                )}
              </ol>
            </div>

            <div className="rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Besoin plus urgent ?</h2>
              <p className="mt-4 text-sm leading-relaxed text-fog">
                Pour une panne bloquante, réservez directement un créneau d’intervention ou appelez-nous.
              </p>
              <ButtonLink to="/rendez-vous" variant="outline" className="mt-5 w-full">
                Prendre rendez-vous
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </>);

}
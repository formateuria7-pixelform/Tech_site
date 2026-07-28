import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, Input, Textarea, Select } from '../components/ui/Field';
import { company } from '../data/content';
import { useStore } from '../store/useStore';
import { reference } from '../lib/format';

const subjects = [
'Question sur une prestation',
'Question sur un produit',
'Suivi de commande',
'Support technique',
'Facturation',
'Autre'];


export function Contact() {
  const addQuoteMessage = useStore((s) => s.addQuoteMessage);
  const [sent, setSent] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [subject, setSubject] = React.useState(subjects[0]);
  const [message, setMessage] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Nom requis';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Adresse e-mail invalide';
    if (message.trim().length < 20) next.message = 'Message de 20 caractères minimum';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error('Merci de compléter les champs signalés.');
      return;
    }
    const ref = reference('MSG');
    setSent(ref);
    setMessage('');
    toast.success('Message envoyé', { description: `Référence ${ref}` });
    void addQuoteMessage;
  };

  return (
    <>
      <Seo
        title="Contact"
        description={`Contactez ${company.name} : téléphone, e-mail, adresse, horaires et formulaire de contact avec réponse sous 2 heures ouvrées.`} />
      
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre projet"
        intro="Par téléphone, par e-mail ou via le formulaire. Nous répondons sous 2 heures ouvrées."
        crumbs={[{ label: 'Contact' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-14 xl:px-10">
          {sent ?
          <div className="rounded-3xl border border-volt/25 bg-coal p-8 lg:p-10">
              <CheckCircle2Icon className="h-9 w-9 text-volt" aria-hidden="true" />
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-paper">
                Message envoyé
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Référence <span className="font-mono text-paper">{sent}</span>. Un accusé de réception a été
                envoyé à {email}. Nous revenons vers vous sous 2 heures ouvrées.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setSent(null)}>
                  Envoyer un autre message
                </Button>
                <Link
                to="/devis"
                className="inline-flex h-11 items-center rounded-full bg-volt px-5 text-sm font-medium text-ink hover:bg-[#d8ff6d]">
                
                  Demander un devis
                </Link>
              </div>
            </div> :

          <form onSubmit={submit} className="rounded-3xl border border-paper/10 bg-coal p-7 lg:p-9" noValidate>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Formulaire de contact</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" htmlFor="ct-name" required error={errors.name}>
                  <Input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} invalid={!!errors.name} />
                </Field>
                <Field label="Téléphone (optionnel)" htmlFor="ct-phone">
                  <Input id="ct-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
                <Field label="E-mail" htmlFor="ct-email" required error={errors.email} className="sm:col-span-2">
                  <Input
                  id="ct-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={!!errors.email} />
                
                </Field>
                <Field label="Sujet" htmlFor="ct-subject" required className="sm:col-span-2">
                  <Select id="ct-subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {subjects.map((s) =>
                  <option key={s} value={s}>
                        {s}
                      </option>
                  )}
                  </Select>
                </Field>
                <Field label="Message" htmlFor="ct-message" required error={errors.message} className="sm:col-span-2">
                  <Textarea
                  id="ct-message"
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  invalid={!!errors.message}
                  placeholder="Décrivez votre demande…" />
                
                </Field>
              </div>
              <Button type="submit" size="lg" className="mt-7">
                Envoyer le message
              </Button>
              <p className="mt-4 text-xs leading-relaxed text-fog">
                Vos données sont utilisées uniquement pour traiter votre demande — voir la{' '}
                <Link to="/confidentialite" className="text-volt underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </form>
          }

          <aside className="space-y-6">
            <div className="rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Coordonnées</h2>
              <ul className="mt-6 space-y-5 text-sm">
                <li>
                  <a
                    href={`tel:${company.phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-3 text-paper transition-colors hover:text-volt">
                    
                    <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                    <span>
                      {company.phone}
                      <span className="mt-0.5 block text-xs text-fog">Standard technique</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-start gap-3 text-paper transition-colors hover:text-volt">
                    
                    <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                    <span>
                      {company.email}
                      <span className="mt-0.5 block text-xs text-fog">Réponse sous 2 h ouvrées</span>
                    </span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-paper">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                  <span>
                    {company.address}
                    <span className="mt-0.5 block text-xs text-fog">Atelier et dépôt</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-paper">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                  <span>
                    {company.hours.map((h) =>
                    <span key={h.day} className="block text-sm">
                        {h.day} — <span className="text-fog">{h.value}</span>
                      </span>
                    )}
                  </span>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl border border-paper/10">
              <iframe
                title="Carte de localisation"
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.82%2C45.72%2C4.88%2C45.76&layer=mapnik&marker=45.74%2C4.85"
                className="h-64 w-full grayscale-[0.85] contrast-[1.1]"
                loading="lazy" />
              
            </div>
          </aside>
        </div>
      </section>
    </>);

}
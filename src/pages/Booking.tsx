import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { addDays, startOfDay, isSameDay, isWeekend, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircle2Icon, CalendarPlusIcon, MapPinIcon, VideoIcon, WrenchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button, ButtonLink } from '../components/ui/Button';
import { Field, Input, Textarea, Select } from '../components/ui/Field';
import { services } from '../data/services';
import { useCurrentUser, useStore, type Appointment } from '../store/useStore';
import { cx } from '../lib/format';

const ALL_SLOTS = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30'];

const modes = [
{ key: 'sur-site', label: 'Sur site', detail: 'Chez vous ou dans vos locaux', icon: MapPinIcon },
{ key: 'atelier', label: 'En atelier', detail: 'Dépôt du matériel à Lyon 7e', icon: WrenchIcon },
{ key: 'visio', label: 'À distance', detail: 'Diagnostic en visioconférence', icon: VideoIcon }] as
const;

export function Booking() {
  const [params] = useSearchParams();
  const user = useCurrentUser();
  const appointments = useStore((s) => s.appointments);
  const createAppointment = useStore((s) => s.createAppointment);

  const preselected = params.get('service') ?? '';
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [date, setDate] = React.useState<Date | null>(null);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [serviceSlug, setServiceSlug] = React.useState(
    services.some((s) => s.slug === preselected) ? preselected : services[0].slug
  );
  const [mode, setMode] = React.useState<Appointment['mode']>('sur-site');
  const [name, setName] = React.useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState(user?.phone ?? '');
  const [address, setAddress] = React.useState(
    user ? `${user.address.line1}, ${user.address.postalCode} ${user.address.city}` : ''
  );
  const [note, setNote] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [created, setCreated] = React.useState<Appointment | null>(null);

  const days = React.useMemo(() => {
    const base = startOfDay(addDays(new Date(), 1 + weekOffset * 7));
    return Array.from({ length: 7 }, (_, i) => addDays(base, i));
  }, [weekOffset]);

  const bookedSlots = React.useMemo(() => {
    if (!date) return [];
    return appointments.
    filter((a) => a.status !== 'annule' && isSameDay(new Date(a.date), date)).
    map((a) => a.slot);
  }, [appointments, date]);

  const availableSlots = React.useMemo(() => {
    if (!date) return [];
    // Le samedi, seuls les créneaux du matin sont ouverts ; le dimanche est fermé.
    const day = date.getDay();
    if (day === 0) return [];
    const base = day === 6 ? ALL_SLOTS.slice(0, 3) : ALL_SLOTS;
    return base.map((s) => ({ slot: s, taken: bookedSlots.includes(s) }));
  }, [date, bookedSlots]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!date) next.date = 'Choisissez une date';
    if (!slot) next.slot = 'Choisissez un créneau';
    if (name.trim().length < 2) next.name = 'Nom requis';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Adresse e-mail invalide';
    if (phone.trim().length < 9) next.phone = 'Numéro invalide';
    if (mode !== 'visio' && address.trim().length < 5) next.address = 'Adresse requise pour ce mode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Merci de compléter les champs signalés.');
      return;
    }
    const service = services.find((s) => s.slug === serviceSlug)!;
    const appointment = createAppointment({
      serviceSlug,
      serviceName: service.name,
      date: date!.toISOString(),
      slot: slot!,
      mode,
      contact: { name, email, phone },
      address: mode === 'visio' ? 'Visioconférence' : address,
      note
    });
    setCreated(appointment);
    toast.success('Rendez-vous confirmé', { description: appointment.ref });
  };

  const calendarLink = (a: Appointment) => {
    const [h, m] = a.slot.split(':').map(Number);
    const start = new Date(a.date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `OHMEGA — ${a.serviceName}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `Référence ${a.ref}. ${a.note || ''}`,
      location: a.address
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  if (created) {
    return (
      <>
        <Seo title="Rendez-vous confirmé" description="Votre créneau d’intervention est réservé." />
        <PageHeader
          eyebrow="Rendez-vous"
          title="Créneau confirmé"
          crumbs={[{ label: 'Rendez-vous', to: '/rendez-vous' }, { label: created.ref }]} />
        
        <section className="bg-ink py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 xl:px-10">
            <div className="rounded-3xl border border-volt/25 bg-coal p-8 lg:p-10">
              <CheckCircle2Icon className="h-9 w-9 text-volt" aria-hidden="true" />
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-paper">
                {format(new Date(created.date), 'EEEE d MMMM yyyy', { locale: fr })} à {created.slot}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Référence <span className="font-mono text-paper">{created.ref}</span>. Une confirmation a été
                envoyée à {created.contact.email}, avec un rappel automatique 24 h avant l’intervention.
              </p>

              <dl className="mt-8 grid gap-5 border-t border-paper/10 pt-7 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Prestation</dt>
                  <dd className="mt-1 text-sm text-paper">{created.serviceName}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Mode</dt>
                  <dd className="mt-1 text-sm text-paper">{created.mode}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Lieu</dt>
                  <dd className="mt-1 text-sm text-paper">{created.address}</dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-wrap gap-3 border-t border-paper/10 pt-8">
                <a
                  href={calendarLink(created)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-volt px-5 text-sm font-medium text-ink transition-colors hover:bg-[#d8ff6d]">
                  
                  <CalendarPlusIcon className="h-4 w-4" aria-hidden="true" />
                  Ajouter à mon agenda
                </a>
                <ButtonLink to="/compte/rendez-vous" variant="outline">
                  Gérer mes rendez-vous
                </ButtonLink>
                <ButtonLink to="/devis" variant="ghost">
                  Demander aussi un devis
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </>);

  }

  return (
    <>
      <Seo
        title="Prendre rendez-vous"
        description="Réservez un créneau d’intervention sur site, en atelier ou à distance. Confirmation immédiate et rappel automatique." />
      
      <PageHeader
        eyebrow="Rendez-vous"
        title="Réservez un créneau"
        intro="Choisissez la prestation, la date et l’horaire. Les créneaux affichés sont réellement disponibles."
        crumbs={[{ label: 'Rendez-vous' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-14 xl:px-10">
          <form onSubmit={submit} className="space-y-8" noValidate>
            <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                Prestation et mode
              </legend>
              <div className="mt-5 space-y-5">
                <Field label="Service" htmlFor="service" required>
                  <Select id="service" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)}>
                    {services.map((s) =>
                    <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    )}
                  </Select>
                </Field>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                    Mode d’intervention <span className="text-volt">*</span>
                  </span>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                    {modes.map(({ key, label, detail, icon: Icon }) =>
                    <li key={key}>
                        <label
                        className={cx(
                          'flex h-full cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-colors',
                          mode === key ? 'border-volt bg-volt/8' : 'border-paper/12 hover:border-paper/30'
                        )}>
                        
                          <span className="flex items-center gap-2">
                            <input
                            type="radio"
                            name="mode"
                            value={key}
                            checked={mode === key}
                            onChange={() => setMode(key)}
                            className="h-4 w-4 accent-volt" />
                          
                            <Icon className="h-4 w-4 text-volt" aria-hidden="true" />
                            <span className="text-sm font-medium text-paper">{label}</span>
                          </span>
                          <span className="text-xs text-fog">{detail}</span>
                        </label>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                Date et créneau
              </legend>

              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                  disabled={weekOffset === 0}
                  aria-label="Semaine précédente"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-volt disabled:opacity-30">
                  
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                  {format(days[0], 'd MMM', { locale: fr })} — {format(days[6], 'd MMM yyyy', { locale: fr })}
                </p>
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => Math.min(6, w + 1))}
                  disabled={weekOffset === 6}
                  aria-label="Semaine suivante"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-volt disabled:opacity-30">
                  
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((d) => {
                  const closed = d.getDay() === 0;
                  const selected = date && isSameDay(d, date);
                  return (
                    <li key={d.toISOString()}>
                      <button
                        type="button"
                        disabled={closed}
                        onClick={() => {
                          setDate(d);
                          setSlot(null);
                        }}
                        aria-pressed={!!selected}
                        className={cx(
                          'flex w-full flex-col items-center gap-1 rounded-xl border py-3 transition-colors',
                          selected ?
                          'border-volt bg-volt text-ink' :
                          closed ?
                          'border-paper/8 text-fog/40' :
                          'border-paper/12 text-paper hover:border-paper/35'
                        )}>
                        
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
                          {format(d, 'EEE', { locale: fr })}
                        </span>
                        <span className="font-display text-lg font-semibold">{format(d, 'd')}</span>
                        <span className="font-mono text-[9px] uppercase">
                          {closed ? 'Fermé' : isWeekend(d) ? 'Matin' : format(d, 'MMM', { locale: fr })}
                        </span>
                      </button>
                    </li>);

                })}
              </ul>
              {errors.date &&
              <p role="alert" className="mt-3 text-xs text-red-400">
                  {errors.date}
                </p>
              }

              {date &&
              <div className="mt-7 border-t border-paper/10 pt-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                    Créneaux du {format(date, 'EEEE d MMMM', { locale: fr })}
                  </p>
                  {availableSlots.length === 0 ?
                <p className="mt-4 text-sm text-fog">Aucun créneau ce jour. Choisissez une autre date.</p> :

                <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {availableSlots.map(({ slot: s, taken }) =>
                  <li key={s}>
                          <button
                      type="button"
                      disabled={taken}
                      onClick={() => setSlot(s)}
                      aria-pressed={slot === s}
                      className={cx(
                        'w-full rounded-xl border py-3 font-mono text-sm transition-colors',
                        slot === s ?
                        'border-volt bg-volt text-ink' :
                        taken ?
                        'border-paper/8 text-fog/40 line-through' :
                        'border-paper/12 text-paper hover:border-paper/35'
                      )}>
                      
                            {s}
                          </button>
                        </li>
                  )}
                    </ul>
                }
                  {errors.slot &&
                <p role="alert" className="mt-3 text-xs text-red-400">
                      {errors.slot}
                    </p>
                }
                </div>
              }
            </fieldset>

            <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                Vos coordonnées
              </legend>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" htmlFor="rdv-name" required error={errors.name}>
                  <Input id="rdv-name" value={name} onChange={(e) => setName(e.target.value)} invalid={!!errors.name} />
                </Field>
                <Field label="Téléphone" htmlFor="rdv-phone" required error={errors.phone}>
                  <Input
                    id="rdv-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    invalid={!!errors.phone} />
                  
                </Field>
                <Field label="E-mail" htmlFor="rdv-email" required error={errors.email} className="sm:col-span-2">
                  <Input
                    id="rdv-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    invalid={!!errors.email} />
                  
                </Field>
                {mode !== 'visio' &&
                <Field
                  label="Adresse d’intervention"
                  htmlFor="rdv-address"
                  required
                  error={errors.address}
                  className="sm:col-span-2">
                  
                    <Input
                    id="rdv-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    invalid={!!errors.address} />
                  
                  </Field>
                }
                <Field
                  label="Précisions (optionnel)"
                  htmlFor="rdv-note"
                  className="sm:col-span-2"
                  hint="Étage, code d’accès, matériel concerné, symptômes constatés…">
                  
                  <Textarea id="rdv-note" value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
                </Field>
              </div>

              <Button type="submit" size="lg" className="mt-7 w-full sm:w-auto">
                Confirmer le rendez-vous
              </Button>
            </fieldset>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Récapitulatif</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Prestation</dt>
                  <dd className="mt-1 text-paper">{services.find((s) => s.slug === serviceSlug)?.name}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Mode</dt>
                  <dd className="mt-1 text-paper">{modes.find((m) => m.key === mode)?.label}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Date</dt>
                  <dd className="mt-1 text-paper">
                    {date ? format(date, 'EEEE d MMMM yyyy', { locale: fr }) : 'Non sélectionnée'}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Créneau</dt>
                  <dd className="mt-1 text-paper">{slot ?? 'Non sélectionné'}</dd>
                </div>
              </dl>
              <p className="mt-6 rounded-xl bg-ink/60 p-4 text-xs leading-relaxed text-fog">
                Durée type d’une intervention : 1 h 30. Annulation ou report gratuits jusqu’à 24 h avant, depuis
                votre espace client.
              </p>
            </div>

            <div className="rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Projet à chiffrer ?</h2>
              <p className="mt-4 text-sm leading-relaxed text-fog">
                Pour une installation complète, commencez par une demande de devis : nous planifierons la visite
                technique adaptée.
              </p>
              <Link
                to="/devis"
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full border border-paper/20 text-sm text-paper transition-colors hover:border-volt hover:text-volt">
                
                Demander un devis
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>);

}
import React from 'react';
import { ShieldCheckIcon, UsersIcon, RecycleIcon, GaugeIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Counter } from '../components/ui/Counter';
import { ButtonLink } from '../components/ui/Button';
import { company, stats, partners } from '../data/content';

const values = [
{
  icon: ShieldCheckIcon,
  title: 'Traçabilité totale',
  text: 'Chaque intervention est documentée : schémas, configurations, procès-verbaux de recette et historique dans votre espace client.'
},
{
  icon: GaugeIcon,
  title: 'Engagement de délai',
  text: 'Nos SLA sont publiés et mesurés. Nous communiquons notre taux de respect des délais, y compris quand il baisse.'
},
{
  icon: UsersIcon,
  title: 'Un référent unique',
  text: 'Pas de transfert d’appel en cascade : le même technicien suit votre dossier du premier contact à la recette.'
},
{
  icon: RecycleIcon,
  title: 'Matériel durable',
  text: 'Nous privilégions les références réparables, reprenons l’ancien matériel et attestons l’effacement des données.'
}];


const timeline = [
{ year: '2009', title: 'Création de l’atelier', text: 'Deux techniciens, une activité de dépannage informatique de proximité à Lyon 7e.' },
{ year: '2013', title: 'Ouverture du pôle sécurité', text: 'Premiers chantiers de vidéoprotection et de contrôle d’accès pour des commerces et copropriétés.' },
{ year: '2017', title: 'Contrats de maintenance', text: 'Structuration de l’offre d’infogérance avec engagements de délai et astreinte.' },
{ year: '2021', title: 'Pôle réseaux et infrastructures', text: 'Certification câblage cuivre et fibre, déploiements multi-sites pour PME et collectivités.' },
{ year: '2026', title: 'Plateforme unifiée', text: 'Devis, rendez-vous, boutique et suivi centralisés dans un espace client unique.' }];


export function About() {
  return (
    <>
      <Seo
        title="À propos"
        description={`${company.legalName} : ${stats[3].value} clients sous contrat, ${stats[0].value} interventions depuis ${company.since}. Notre méthode, nos valeurs et notre histoire.`} />
      
      <PageHeader
        eyebrow="À propos"
        title={`Une entreprise technique, pas un revendeur.`}
        intro={`Depuis ${company.since}, ${company.name} conçoit, installe et maintient les systèmes électroniques, de sécurité et informatiques de ses clients à Lyon et en région.`}
        crumbs={[{ label: 'À propos' }]}>
        
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/devis" size="lg">
            Demander un devis
          </ButtonLink>
          <ButtonLink to="/realisations" size="lg" variant="outline">
            Voir nos réalisations
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="bg-ink py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tightest text-paper lg:text-4xl">
                Notre conviction : la qualité d’une installation se juge trois ans plus tard.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-base leading-relaxed text-fog">
              <p>
                Beaucoup d’installations fonctionnent le jour de la livraison. Peu restent maintenables,
                documentées et évolutives après plusieurs années d’exploitation. C’est cette différence qui
                structure notre manière de travailler.
              </p>
              <p>
                Nous refusons les chantiers que nous ne pouvons pas garantir, nous chiffrons ligne par ligne sans
                poste « divers », et nous remettons systématiquement un dossier technique complet — même quand
                le client ne le demande pas.
              </p>
              <p>
                Notre équipe compte aujourd’hui quatorze personnes : techniciens réseaux, courants faibles,
                sûreté, et un pôle atelier pour la réparation et la préparation des postes.
              </p>
            </Reveal>
          </div>

          <ul className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-paper/12 bg-paper/12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) =>
            <Reveal as="li" key={s.label} delay={i * 0.06} className="bg-ink p-7 lg:p-9">
                <p className="font-display text-4xl font-semibold tracking-tightest text-volt">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-4 text-sm font-medium text-paper">{s.label}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">{s.detail}</p>
              </Reveal>
            )}
          </ul>
        </div>
      </section>

      <section className="border-t border-paper/10 bg-coal py-16 lg:py-24" aria-labelledby="valeurs">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <h2
            id="valeurs"
            className="font-display text-3xl font-semibold tracking-tightest text-paper lg:text-4xl">
            
            Quatre engagements concrets
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, text }, i) =>
            <Reveal as="li" key={title} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-paper/10 bg-ink p-7 lg:p-9">
                  <Icon className="h-6 w-6 text-volt" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-paper">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fog">{text}</p>
                </div>
              </Reveal>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-ink py-16 lg:py-24" aria-labelledby="histoire">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <h2
            id="histoire"
            className="font-display text-3xl font-semibold tracking-tightest text-paper lg:text-4xl">
            
            Notre parcours
          </h2>
          <ol className="mt-12 space-y-px overflow-hidden rounded-3xl border border-paper/12 bg-paper/12">
            {timeline.map((t, i) =>
            <Reveal as="li" key={t.year} delay={i * 0.05} className="bg-ink">
                <div className="flex flex-col gap-3 p-7 sm:flex-row sm:items-baseline sm:gap-10 lg:p-9">
                  <span className="font-display text-2xl font-semibold text-volt sm:w-24">{t.year}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-paper">{t.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            )}
          </ol>

          <Reveal className="mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Marques distribuées</h2>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {partners.map((p) =>
              <li key={p} className="font-display text-xl font-semibold text-paper/40">
                  {p}
                </li>
              )}
            </ul>
          </Reveal>

          <Reveal className="mt-16 rounded-3xl border border-paper/10 bg-coal p-8 lg:p-12">
            <dl className="grid gap-8 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Raison sociale</dt>
                <dd className="mt-2 text-sm text-paper">{company.legalName}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">SIRET</dt>
                <dd className="mt-2 font-mono text-sm text-paper">{company.siret}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">TVA intracom.</dt>
                <dd className="mt-2 font-mono text-sm text-paper">{company.vat}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>
    </>);

}
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShareIcon, ClockIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Field';
import { StatusBadge } from '../components/ui/StatusBadge';
import { NotFound } from './NotFound';
import { useCurrentUser, useStore } from '../store/useStore';
import { formatDate, formatDateTime } from '../lib/format';

export function BlogPost() {
  const { slug = '' } = useParams();
  const journal = useStore((s) => s.journal);
  const post = journal.find((p) => p.slug === slug);
  const comments = useStore((s) => s.comments.filter((c) => c.postSlug === slug));
  const addComment = useStore((s) => s.addComment);
  const user = useCurrentUser();

  const [author, setAuthor] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    if (user) {
      setAuthor(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
    }
  }, [user]);

  if (!post) return <NotFound />;

  const related = journal.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const published = comments.filter((c) => c.status === 'publie');
  const pending = comments.filter((c) => c.status === 'en-moderation');

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
        return;
      } catch {

        /* partage annulé */}
    }
    await navigator.clipboard.writeText(url);
    toast.success('Lien copié dans le presse-papiers');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || text.trim().length < 10) {
      toast.error('Nom, e-mail valide et commentaire de 10 caractères minimum requis.');
      return;
    }
    addComment(post.slug, author.trim(), email.trim(), text.trim());
    setText('');
    toast.success('Commentaire soumis', { description: 'Il sera publié après modération.' });
  };

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.image}
        type="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          author: { '@type': 'Person', name: post.author },
          publisher: { '@type': 'Organization', name: 'OHMEGA' }
        }} />
      
      <PageHeader
        eyebrow={post.category}
        title={post.title}
        crumbs={[{ label: 'Actualités', to: '/actualites' }, { label: post.category }]}>
        
        <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
          <span className="flex items-center gap-2">
            <UserIcon className="h-3.5 w-3.5 text-volt" aria-hidden="true" />
            {post.author}
          </span>
          <span className="flex items-center gap-2">
            <ClockIcon className="h-3.5 w-3.5 text-volt" aria-hidden="true" />
            {post.readingTime} min de lecture
          </span>
          <span>{formatDate(post.date)}</span>
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-2 text-volt transition-colors hover:text-paper">
            
            <ShareIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Partager
          </button>
        </div>
      </PageHeader>

      <article className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <div className="overflow-hidden rounded-3xl border border-paper/10 bg-steel">
            <img src={post.image} alt="" className="aspect-[21/9] w-full object-cover" />
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="max-w-2xl">
                {post.body.map((p, i) =>
                <p
                  key={i}
                  className={
                  i === 0 ?
                  'font-display text-xl leading-relaxed text-paper lg:text-2xl' :
                  'mt-6 text-base leading-[1.8] text-fog'
                  }>
                  
                    {p}
                  </p>
                )}
              </div>

              <section className="mt-16 border-t border-paper/10 pt-12" aria-labelledby="commentaires">
                <h2 id="commentaires" className="font-display text-2xl font-semibold tracking-tight text-paper">
                  Commentaires ({published.length})
                </h2>

                {published.length === 0 ?
                <p className="mt-4 text-sm text-fog">
                    Aucun commentaire publié pour l’instant. Les contributions sont modérées avant publication.
                  </p> :

                <ul className="mt-8 space-y-6">
                    {published.map((c) =>
                  <li key={c.id} className="border-b border-paper/10 pb-6 last:border-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-medium text-paper">{c.author}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {formatDateTime(c.date)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-fog">{c.text}</p>
                      </li>
                  )}
                  </ul>
                }

                {pending.length > 0 &&
                <div className="mt-8 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
                    <div className="flex items-center gap-3">
                      <StatusBadge status="en-moderation" />
                      <p className="text-sm text-fog">
                        {pending.length} commentaire{pending.length > 1 ? 's' : ''} en attente de validation.
                      </p>
                    </div>
                  </div>
                }

                <form onSubmit={submit} className="mt-10 rounded-3xl border border-paper/10 bg-coal p-7">
                  <h3 className="font-display text-lg font-semibold text-paper">Laisser un commentaire</h3>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Nom" htmlFor="c-author" required>
                      <Input id="c-author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </Field>
                    <Field label="E-mail (non publié)" htmlFor="c-email" required>
                      <Input
                        id="c-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                      
                    </Field>
                    <Field label="Commentaire" htmlFor="c-text" required className="sm:col-span-2">
                      <Textarea id="c-text" value={text} onChange={(e) => setText(e.target.value)} rows={5} required />
                    </Field>
                  </div>
                  <Button type="submit" className="mt-6">
                    Soumettre le commentaire
                  </Button>
                  <p className="mt-4 text-xs text-fog">
                    Votre commentaire sera relu par notre équipe avant publication.
                  </p>
                </form>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Besoin d’un avis ?</h2>
                <p className="mt-4 text-sm leading-relaxed text-fog">
                  Un technicien peut auditer votre installation existante et vous remettre un plan de
                  remédiation priorisé.
                </p>
                <Link
                  to="/devis"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-volt text-sm font-medium text-ink transition-colors hover:bg-[#d8ff6d]">
                  
                  Demander un audit
                </Link>
              </div>

              {related.length > 0 &&
              <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                    Sur le même thème
                  </h2>
                  <ul className="mt-5 space-y-5">
                    {related.map((r) =>
                  <li key={r.slug}>
                        <Link to={`/actualites/${r.slug}`} className="group block">
                          <span className="block text-sm font-medium leading-snug text-paper group-hover:text-volt">
                            {r.title}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {formatDate(r.date)} — {r.readingTime} min
                          </span>
                        </Link>
                      </li>
                  )}
                  </ul>
                </div>
              }
            </aside>
          </div>
        </div>
      </article>
    </>);

}
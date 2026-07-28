import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, EyeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { DataTable, type Column } from './DataTable';
import { Button } from '../ui/Button';
import { Field, Input, Textarea, Select } from '../ui/Field';
import { useStore } from '../../store/useStore';
import type { Post } from '../../data/content';
import { formatDate } from '../../lib/format';

const CATEGORIES: Post['category'][] = ['Sécurité', 'Informatique', 'Conseils', 'Entreprise'];

function slugify(value: string): string {
  return value.
  toLowerCase().
  normalize('NFD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '');
}

const blank = (): Post => ({
  slug: '',
  title: '',
  category: 'Conseils',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  readingTime: 4,
  author: 'Équipe OHMEGA',
  image: "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg",
  body: ['']
});

export function PostManager() {
  const journal = useStore((s) => s.journal);
  const savePost = useStore((s) => s.savePost);
  const deletePost = useStore((s) => s.deletePost);
  const [editing, setEditing] = React.useState<Post | null>(null);

  const columns: Column<Post>[] = [
  {
    key: 'title',
    header: 'Article',
    render: (p) =>
    <span>
          <span className="block text-sm text-paper">{p.title}</span>
          <span className="font-mono text-[10px] text-fog">/{p.slug}</span>
        </span>,

    exportValue: (p) => p.title
  },
  { key: 'category', header: 'Catégorie', render: (p) => p.category, exportValue: (p) => p.category },
  { key: 'author', header: 'Auteur', render: (p) => p.author, exportValue: (p) => p.author },
  {
    key: 'date',
    header: 'Publication',
    render: (p) => p.date > new Date().toISOString().slice(0, 10) ? `Planifié — ${formatDate(p.date)}` : formatDate(p.date),
    exportValue: (p) => p.date
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (p) =>
    <div className="flex gap-2">
          <Link
        to={`/actualites/${p.slug}`}
        aria-label={`Voir ${p.title}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-paper/15 text-paper hover:border-volt hover:text-volt">
        
            <EyeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
        type="button"
        onClick={() => setEditing(p)}
        aria-label={`Modifier ${p.title}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-paper/15 text-paper hover:border-volt hover:text-volt">
        
            <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
        type="button"
        onClick={() => {
          if (window.confirm(`Supprimer l’article « ${p.title} » ?`)) {
            deletePost(p.slug);
            toast.success('Article supprimé');
          }
        }}
        aria-label={`Supprimer ${p.title}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10">
        
            <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>,

    exportValue: () => ''
  }];


  return (
    <>
      <DataTable
        title="Actualités"
        rows={journal}
        columns={columns}
        rowKey={(p) => p.slug}
        searchKeys={(p) => `${p.title} ${p.category} ${p.author}`}
        emptyText="Aucun article publié."
        actions={
        <Button size="sm" onClick={() => setEditing(blank())}>
            <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Nouvel article
          </Button>
        } />
      

      {editing &&
      <div className="fixed inset-0 z-[75] flex items-start justify-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-sm">
          <div
          role="dialog"
          aria-modal="true"
          aria-label="Édition d’article"
          className="my-8 w-full max-w-2xl rounded-3xl border border-paper/12 bg-coal p-7">
          
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-paper">
                {editing.slug ? 'Modifier l’article' : 'Nouvel article'}
              </h2>
              <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label="Fermer"
              className="flex h-9 w-9 items-center justify-center rounded-full text-fog hover:bg-paper/5 hover:text-paper">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <form
            onSubmit={(e) => {
              e.preventDefault();
              const post: Post = {
                ...editing,
                slug: editing.slug || slugify(editing.title),
                body: editing.body.filter((p) => p.trim().length > 0)
              };
              if (!post.title || post.body.length === 0) {
                toast.error('Titre et contenu obligatoires.');
                return;
              }
              savePost(post);
              setEditing(null);
              toast.success('Article enregistré');
            }}
            className="mt-6 grid gap-5 sm:grid-cols-2">
            
              <Field label="Titre" htmlFor="po-title" required className="sm:col-span-2">
                <Input
                id="po-title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                required />
              
              </Field>
              <Field label="Catégorie" htmlFor="po-cat" required>
                <Select
                id="po-cat"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as Post['category'] })}>
                
                  {CATEGORIES.map((c) =>
                <option key={c} value={c}>
                      {c}
                    </option>
                )}
                </Select>
              </Field>
              <Field label="Auteur" htmlFor="po-author" required>
                <Input
                id="po-author"
                value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                required />
              
              </Field>
              <Field
              label="Date de publication"
              htmlFor="po-date"
              required
              hint="Une date future planifie la publication.">
              
                <Input
                id="po-date"
                type="date"
                value={editing.date.slice(0, 10)}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                required />
              
              </Field>
              <Field label="Temps de lecture (min)" htmlFor="po-time" required>
                <Input
                id="po-time"
                type="number"
                min={1}
                value={editing.readingTime}
                onChange={(e) => setEditing({ ...editing, readingTime: Number(e.target.value) })}
                required />
              
              </Field>
              <Field label="URL de l’image" htmlFor="po-image" className="sm:col-span-2">
                <Input
                id="po-image"
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              
              </Field>
              <Field label="Chapeau" htmlFor="po-excerpt" required className="sm:col-span-2">
                <Textarea
                id="po-excerpt"
                rows={2}
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                required />
              
              </Field>
              <Field
              label="Corps de l’article"
              htmlFor="po-body"
              required
              hint="Un paragraphe par ligne vide séparée."
              className="sm:col-span-2">
              
                <Textarea
                id="po-body"
                rows={10}
                value={editing.body.join('\n\n')}
                onChange={(e) => setEditing({ ...editing, body: e.target.value.split(/\n\s*\n/) })}
                required />
              
              </Field>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <Button type="submit">Publier / Enregistrer</Button>
                <Button
                type="button"
                variant="outline"
                onClick={() =>
                setEditing({ ...editing, date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10) })
                }>
                
                  Planifier dans 7 jours
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      }
    </>);

}
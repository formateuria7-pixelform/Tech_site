import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from './DataTable';
import { Button } from '../ui/Button';
import { Field, Input, Textarea, Select } from '../ui/Field';
import { useStore } from '../../store/useStore';
import { categories, type Product } from '../../data/catalog';
import { formatPrice } from '../../lib/format';

const blank = (): Product => ({
  slug: '',
  name: '',
  brand: '',
  category: categories[0].slug,
  subcategory: categories[0].children[0].slug,
  price: 0,
  stock: 0,
  rating: 5,
  images: ["/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg"],
  shortDescription: '',
  description: '',
  specs: [],
  reviews: [],
  tags: [],
  warranty: 'Garantie 2 ans',
  reference: ''
});

function slugify(value: string): string {
  return value.
  toLowerCase().
  normalize('NFD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '');
}

export function ProductManager() {
  const catalog = useStore((s) => s.catalog);
  const saveProduct = useStore((s) => s.saveProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const setStock = useStore((s) => s.setStock);

  const [editing, setEditing] = React.useState<Product | null>(null);
  const [category, setCategory] = React.useState('all');

  const rows = category === 'all' ? catalog : catalog.filter((p) => p.category === category);

  const columns: Column<Product>[] = [
  {
    key: 'name',
    header: 'Produit',
    render: (p) =>
    <div className="flex items-center gap-3">
          <span className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-steel">
            <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
          </span>
          <span>
            <span className="block text-sm text-paper">{p.name}</span>
            <span className="font-mono text-[10px] text-fog">{p.reference}</span>
          </span>
        </div>,

    exportValue: (p) => `${p.name} (${p.reference})`
  },
  { key: 'brand', header: 'Marque', render: (p) => p.brand, exportValue: (p) => p.brand },
  {
    key: 'category',
    header: 'Catégorie',
    render: (p) => categories.find((c) => c.slug === p.category)?.name ?? p.category,
    exportValue: (p) => p.category
  },
  { key: 'price', header: 'Prix HT', render: (p) => formatPrice(p.price), exportValue: (p) => String(p.price) },
  {
    key: 'stock',
    header: 'Stock',
    render: (p) =>
    <input
      type="number"
      min={0}
      value={p.stock}
      onChange={(e) => setStock(p.slug, Math.max(0, Number(e.target.value)))}
      aria-label={`Stock de ${p.name}`}
      className="w-20 rounded-lg border border-paper/12 bg-ink px-2 py-1.5 font-mono text-sm text-paper focus:border-volt focus:outline-none" />,


    exportValue: (p) => String(p.stock)
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (p) =>
    <div className="flex gap-2">
          <button
        type="button"
        onClick={() => setEditing(p)}
        aria-label={`Modifier ${p.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-paper/15 text-paper hover:border-volt hover:text-volt">
        
            <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
        type="button"
        onClick={() => {
          if (window.confirm(`Supprimer définitivement « ${p.name} » ?`)) {
            deleteProduct(p.slug);
            toast.success('Produit supprimé');
          }
        }}
        aria-label={`Supprimer ${p.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10">
        
            <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>,

    exportValue: () => ''
  }];


  return (
    <>
      <DataTable
        title="Produits"
        rows={rows}
        columns={columns}
        rowKey={(p) => p.slug}
        searchKeys={(p) => `${p.name} ${p.brand} ${p.reference} ${p.category}`}
        emptyText="Aucun produit. Créez votre première référence."
        filters={[
        {
          label: 'Catégorie',
          value: category,
          onChange: setCategory,
          options: [
          { value: 'all', label: 'Toutes' },
          ...categories.map((c) => ({ value: c.slug, label: c.name }))]

        }]
        }
        actions={
        <Button size="sm" onClick={() => setEditing(blank())}>
            <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Nouveau produit
          </Button>
        } />
      

      {editing &&
      <ProductForm
        product={editing}
        onClose={() => setEditing(null)}
        onSave={(p) => {
          const finalProduct: Product = { ...p, slug: p.slug || slugify(p.name) };
          if (!finalProduct.name || !finalProduct.slug) {
            toast.error('Le nom du produit est obligatoire.');
            return;
          }
          saveProduct(finalProduct);
          setEditing(null);
          toast.success('Produit enregistré');
        }} />

      }
    </>);

}

function ProductForm({
  product,
  onClose,
  onSave




}: {product: Product;onClose: () => void;onSave: (p: Product) => void;}) {
  const [form, setForm] = React.useState<Product>(product);
  const subcategories = categories.find((c) => c.slug === form.category)?.children ?? [];

  return (
    <div className="fixed inset-0 z-[75] flex items-start justify-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.slug ? `Modifier ${product.name}` : 'Nouveau produit'}
        className="my-8 w-full max-w-2xl rounded-3xl border border-paper/12 bg-coal p-7">
        
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-paper">
            {product.slug ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-fog hover:bg-paper/5 hover:text-paper">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="mt-6 grid gap-5 sm:grid-cols-2">
          
          <Field label="Nom" htmlFor="pm-name" required className="sm:col-span-2">
            <Input
              id="pm-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required />
            
          </Field>
          <Field label="Marque" htmlFor="pm-brand" required>
            <Input
              id="pm-brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              required />
            
          </Field>
          <Field label="Référence" htmlFor="pm-ref" required>
            <Input
              id="pm-ref"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              required />
            
          </Field>
          <Field label="Catégorie" htmlFor="pm-cat" required>
            <Select
              id="pm-cat"
              value={form.category}
              onChange={(e) => {
                const cat = categories.find((c) => c.slug === e.target.value)!;
                setForm({ ...form, category: cat.slug, subcategory: cat.children[0].slug });
              }}>
              
              {categories.map((c) =>
              <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              )}
            </Select>
          </Field>
          <Field label="Sous-catégorie" htmlFor="pm-sub" required>
            <Select
              id="pm-sub"
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}>
              
              {subcategories.map((c) =>
              <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              )}
            </Select>
          </Field>
          <Field label="Prix HT (€)" htmlFor="pm-price" required>
            <Input
              id="pm-price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required />
            
          </Field>
          <Field label="Stock" htmlFor="pm-stock" required>
            <Input
              id="pm-stock"
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              required />
            
          </Field>
          <Field label="Garantie" htmlFor="pm-warranty" className="sm:col-span-2">
            <Input
              id="pm-warranty"
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
            
          </Field>
          <Field label="URL de l’image principale" htmlFor="pm-image" className="sm:col-span-2">
            <Input
              id="pm-image"
              value={form.images[0] ?? ''}
              onChange={(e) => setForm({ ...form, images: [e.target.value, ...form.images.slice(1)] })} />
            
          </Field>
          <Field label="Accroche" htmlFor="pm-short" required className="sm:col-span-2">
            <Textarea
              id="pm-short"
              rows={2}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              required />
            
          </Field>
          <Field label="Description complète" htmlFor="pm-desc" required className="sm:col-span-2">
            <Textarea
              id="pm-desc"
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required />
            
          </Field>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit">Enregistrer</Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>);

}
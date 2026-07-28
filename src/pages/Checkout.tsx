import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCardIcon, BuildingIcon, SmartphoneIcon, WalletIcon, LockIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { useCartDetails, useCurrentUser, useStore } from '../store/useStore';
import { formatPrice, cx } from '../lib/format';

const addressSchema = z.object({
  line1: z.string().min(5, 'Adresse trop courte'),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal à 5 chiffres'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(2, 'Pays requis')
});

const schema = z.
object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(9, 'Numéro de téléphone invalide'),
  company: z.string().optional(),
  shipping: addressSchema,
  billingSame: z.boolean(),
  billing: addressSchema.partial().optional(),
  paymentMethod: z.enum(['carte', 'virement', 'paypal', 'mobile-money']),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Vous devez accepter les CGV' }) })
}).
superRefine((data, ctx) => {
  if (!data.billingSame) {
    const parsed = addressSchema.safeParse(data.billing ?? {});
    if (!parsed.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['billing', 'line1'],
        message: 'Adresse de facturation incomplète'
      });
    }
  }
});

type FormValues = z.infer<typeof schema>;

const payments = [
{ key: 'carte', label: 'Carte bancaire', detail: 'Visa, Mastercard — 3D Secure', icon: CreditCardIcon },
{ key: 'virement', label: 'Virement bancaire', detail: 'IBAN transmis avec la facture', icon: BuildingIcon },
{ key: 'paypal', label: 'PayPal', detail: 'Redirection sécurisée', icon: WalletIcon },
{ key: 'mobile-money', label: 'Mobile Money', detail: 'Orange Money, Wave, MTN', icon: SmartphoneIcon }] as
const;

export function Checkout() {
  const { lines, subtotal, discount, shipping, tax, total, coupon } = useCartDetails();
  const user = useCurrentUser();
  const placeOrder = useStore((s) => s.placeOrder);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      company: user?.company ?? '',
      shipping: user?.address ?? { line1: '', postalCode: '', city: '', country: 'France' },
      billingSame: true,
      paymentMethod: 'carte'
    }
  });

  const billingSame = watch('billingSame');
  const paymentMethod = watch('paymentMethod');

  React.useEffect(() => {
    if (lines.length === 0) navigate('/panier', { replace: true });
  }, [lines.length, navigate]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    // Simulation de la latence d'une passerelle de paiement avant confirmation.
    await new Promise((r) => setTimeout(r, 900));
    const order = placeOrder({
      paymentMethod: values.paymentMethod,
      shippingAddress: values.shipping,
      billingAddress: values.billingSame ?
      values.shipping :
      {
        line1: values.billing?.line1 ?? values.shipping.line1,
        postalCode: values.billing?.postalCode ?? values.shipping.postalCode,
        city: values.billing?.city ?? values.shipping.city,
        country: values.billing?.country ?? values.shipping.country
      }
    });
    setSubmitting(false);
    if (!order) {
      toast.error('Le panier est vide.');
      return;
    }
    toast.success('Paiement confirmé', { description: `Commande ${order.ref}` });
    navigate(`/commande/${order.ref}`);
  };

  if (lines.length === 0) return null;

  return (
    <>
      <Seo title="Paiement" description="Tunnel de commande sécurisé : livraison, facturation et choix du moyen de paiement." />
      <PageHeader
        eyebrow="Étape 2 sur 3"
        title="Finaliser la commande"
        crumbs={[{ label: 'Panier', to: '/panier' }, { label: 'Paiement' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14" noValidate>
            <div className="space-y-8">
              <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
                <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                  Coordonnées
                </legend>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Prénom" htmlFor="firstName" required error={errors.firstName?.message}>
                    <Input id="firstName" invalid={!!errors.firstName} {...register('firstName')} />
                  </Field>
                  <Field label="Nom" htmlFor="lastName" required error={errors.lastName?.message}>
                    <Input id="lastName" invalid={!!errors.lastName} {...register('lastName')} />
                  </Field>
                  <Field label="E-mail" htmlFor="email" required error={errors.email?.message}>
                    <Input id="email" type="email" invalid={!!errors.email} {...register('email')} />
                  </Field>
                  <Field label="Téléphone" htmlFor="phone" required error={errors.phone?.message}>
                    <Input id="phone" type="tel" invalid={!!errors.phone} {...register('phone')} />
                  </Field>
                  <Field label="Société (optionnel)" htmlFor="company" className="sm:col-span-2">
                    <Input id="company" {...register('company')} />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
                <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                  Adresse de livraison
                </legend>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Adresse"
                    htmlFor="shipping-line1"
                    required
                    error={errors.shipping?.line1?.message}
                    className="sm:col-span-2">
                    
                    <Input
                      id="shipping-line1"
                      invalid={!!errors.shipping?.line1}
                      {...register('shipping.line1')} />
                    
                  </Field>
                  <Field label="Code postal" htmlFor="shipping-cp" required error={errors.shipping?.postalCode?.message}>
                    <Input
                      id="shipping-cp"
                      inputMode="numeric"
                      invalid={!!errors.shipping?.postalCode}
                      {...register('shipping.postalCode')} />
                    
                  </Field>
                  <Field label="Ville" htmlFor="shipping-city" required error={errors.shipping?.city?.message}>
                    <Input id="shipping-city" invalid={!!errors.shipping?.city} {...register('shipping.city')} />
                  </Field>
                  <Field label="Pays" htmlFor="shipping-country" required error={errors.shipping?.country?.message}>
                    <Input
                      id="shipping-country"
                      invalid={!!errors.shipping?.country}
                      {...register('shipping.country')} />
                    
                  </Field>
                </div>

                <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-fog">
                  <input type="checkbox" className="h-4 w-4 rounded accent-volt" {...register('billingSame')} />
                  L’adresse de facturation est identique
                </label>

                {!billingSame &&
                <div className="mt-6 grid gap-5 border-t border-paper/10 pt-6 sm:grid-cols-2">
                    <Field
                    label="Adresse de facturation"
                    htmlFor="billing-line1"
                    required
                    error={errors.billing?.line1?.message}
                    className="sm:col-span-2">
                    
                      <Input id="billing-line1" {...register('billing.line1')} />
                    </Field>
                    <Field label="Code postal" htmlFor="billing-cp" required>
                      <Input id="billing-cp" inputMode="numeric" {...register('billing.postalCode')} />
                    </Field>
                    <Field label="Ville" htmlFor="billing-city" required>
                      <Input id="billing-city" {...register('billing.city')} />
                    </Field>
                    <Field label="Pays" htmlFor="billing-country" required>
                      <Input id="billing-country" defaultValue="France" {...register('billing.country')} />
                    </Field>
                  </div>
                }
              </fieldset>

              <fieldset className="rounded-3xl border border-paper/10 bg-coal p-7">
                <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                  Moyen de paiement
                </legend>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {payments.map(({ key, label, detail, icon: Icon }) =>
                  <li key={key}>
                      <label
                      className={cx(
                        'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                        paymentMethod === key ?
                        'border-volt bg-volt/8' :
                        'border-paper/12 hover:border-paper/30'
                      )}>
                      
                        <input
                        type="radio"
                        value={key}
                        className="mt-1 h-4 w-4 accent-volt"
                        {...register('paymentMethod')} />
                      
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-volt" aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-medium text-paper">{label}</span>
                          <span className="mt-0.5 block text-xs text-fog">{detail}</span>
                        </span>
                      </label>
                    </li>
                  )}
                </ul>

                <p className="mt-6 flex items-start gap-2 rounded-xl bg-ink/60 p-4 text-xs leading-relaxed text-fog">
                  <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                  Les données de paiement sont transmises chiffrées à la passerelle. Aucune donnée bancaire
                  n’est stockée sur nos serveurs.
                </p>

                <div className="mt-6">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-fog">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-volt" {...register('acceptTerms')} />
                    <span>
                      J’accepte les{' '}
                      <Link to="/cgv" className="text-volt underline">
                        conditions générales de vente
                      </Link>{' '}
                      et la{' '}
                      <Link to="/confidentialite" className="text-volt underline">
                        politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.acceptTerms &&
                  <p role="alert" className="mt-2 text-xs text-red-400">
                      {errors.acceptTerms.message}
                    </p>
                  }
                </div>
              </fieldset>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Votre commande</h2>
                <ul className="mt-6 space-y-4">
                  {lines.map(({ product, quantity }) =>
                  <li key={product.slug} className="flex gap-3">
                      <span className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-steel">
                        <img src={product.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-paper">{product.name}</span>
                        <span className="font-mono text-[11px] text-fog">
                          {quantity} × {formatPrice(product.price)}
                        </span>
                      </span>
                      <span className="whitespace-nowrap text-sm text-paper">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </li>
                  )}
                </ul>

                <dl className="mt-7 space-y-3 border-t border-paper/10 pt-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-fog">Sous-total HT</dt>
                    <dd className="text-paper">{formatPrice(subtotal)}</dd>
                  </div>
                  {discount > 0 &&
                  <div className="flex justify-between">
                      <dt className="text-fog">Remise {coupon?.code}</dt>
                      <dd className="text-volt">−{formatPrice(discount)}</dd>
                    </div>
                  }
                  <div className="flex justify-between">
                    <dt className="text-fog">Livraison</dt>
                    <dd className="text-paper">{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-fog">TVA 20 %</dt>
                    <dd className="text-paper">{formatPrice(tax)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-paper/10 pt-4">
                    <dt className="font-display text-base font-semibold text-paper">Total TTC</dt>
                    <dd className="font-display text-2xl font-semibold text-volt">{formatPrice(total)}</dd>
                  </div>
                </dl>

                <Button type="submit" size="lg" className="mt-7 w-full" disabled={submitting}>
                  {submitting ?
                  <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      Traitement du paiement…
                    </> :

                  <>
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      Payer {formatPrice(total)}
                    </>
                  }
                </Button>
                <Link
                  to="/panier"
                  className="mt-4 block text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fog hover:text-paper">
                  
                  ← Revenir au panier
                </Link>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </>);

}
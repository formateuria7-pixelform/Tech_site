import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlusIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { useStore } from '../store/useStore';

const schema = z.
object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(9, 'Numéro invalide'),
  company: z.string().optional(),
  line1: z.string().min(5, 'Adresse requise'),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal à 5 chiffres'),
  city: z.string().min(2, 'Ville requise'),
  password: z.
  string().
  min(10, '10 caractères minimum').
  regex(/[A-Z]/, 'Au moins une majuscule').
  regex(/[0-9]/, 'Au moins un chiffre').
  regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial'),
  confirm: z.string(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Acceptation requise' }) })
}).
refine((d) => d.password === d.confirm, {
  path: ['confirm'],
  message: 'Les mots de passe ne correspondent pas'
});

type FormValues = z.infer<typeof schema>;

const rules = [
{ test: (v: string) => v.length >= 10, label: '10 caractères minimum' },
{ test: (v: string) => /[A-Z]/.test(v), label: 'Une majuscule' },
{ test: (v: string) => /[0-9]/.test(v), label: 'Un chiffre' },
{ test: (v: string) => /[^A-Za-z0-9]/.test(v), label: 'Un caractère spécial' }];


export function Register() {
  const registerUser = useStore((s) => s.register);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const password = watch('password') ?? '';

  const onSubmit = async (values: FormValues) => {
    const result = registerUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      company: values.company || undefined,
      password: values.password,
      address: {
        line1: values.line1,
        postalCode: values.postalCode,
        city: values.city,
        country: 'France'
      }
    });
    if (!result.ok) {
      setError('email', { message: result.error });
      return;
    }
    toast.success('Compte créé', { description: 'Vous êtes connecté à votre espace client.' });
    navigate('/compte');
  };

  return (
    <>
      <Seo
        title="Créer un compte"
        description="Créez votre compte OHMEGA pour suivre vos devis, commandes, rendez-vous et documents en un seul endroit." />
      
      <PageHeader
        eyebrow="Espace client"
        title="Créer un compte"
        intro="Un compte vous donne accès au suivi de vos devis, commandes, rendez-vous et à vos documents."
        crumbs={[{ label: 'Inscription' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 xl:px-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-paper/10 bg-coal p-7 lg:p-9"
            noValidate>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Prénom" htmlFor="r-firstName" required error={errors.firstName?.message}>
                <Input id="r-firstName" invalid={!!errors.firstName} {...register('firstName')} />
              </Field>
              <Field label="Nom" htmlFor="r-lastName" required error={errors.lastName?.message}>
                <Input id="r-lastName" invalid={!!errors.lastName} {...register('lastName')} />
              </Field>
              <Field label="Adresse e-mail" htmlFor="r-email" required error={errors.email?.message}>
                <Input id="r-email" type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} />
              </Field>
              <Field label="Téléphone" htmlFor="r-phone" required error={errors.phone?.message}>
                <Input id="r-phone" type="tel" invalid={!!errors.phone} {...register('phone')} />
              </Field>
              <Field label="Société (optionnel)" htmlFor="r-company" className="sm:col-span-2">
                <Input id="r-company" {...register('company')} />
              </Field>
              <Field label="Adresse" htmlFor="r-line1" required error={errors.line1?.message} className="sm:col-span-2">
                <Input id="r-line1" invalid={!!errors.line1} {...register('line1')} />
              </Field>
              <Field label="Code postal" htmlFor="r-cp" required error={errors.postalCode?.message}>
                <Input id="r-cp" inputMode="numeric" invalid={!!errors.postalCode} {...register('postalCode')} />
              </Field>
              <Field label="Ville" htmlFor="r-city" required error={errors.city?.message}>
                <Input id="r-city" invalid={!!errors.city} {...register('city')} />
              </Field>
              <Field label="Mot de passe" htmlFor="r-password" required error={errors.password?.message}>
                <Input
                  id="r-password"
                  type="password"
                  autoComplete="new-password"
                  invalid={!!errors.password}
                  {...register('password')} />
                
              </Field>
              <Field label="Confirmation" htmlFor="r-confirm" required error={errors.confirm?.message}>
                <Input
                  id="r-confirm"
                  type="password"
                  autoComplete="new-password"
                  invalid={!!errors.confirm}
                  {...register('confirm')} />
                
              </Field>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2" aria-label="Exigences du mot de passe">
              {rules.map((r) => {
                const ok = r.test(password);
                return (
                  <li
                    key={r.label}
                    className={`flex items-center gap-2 text-xs ${ok ? 'text-volt' : 'text-fog'}`}>
                    
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {r.label}
                  </li>);

              })}
            </ul>

            <div className="mt-7">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-fog">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-volt" {...register('acceptTerms')} />
                <span>
                  J’accepte les{' '}
                  <Link to="/cgv" className="text-volt underline">
                    CGV
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

            <Button type="submit" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
              <UserPlusIcon className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? 'Création…' : 'Créer mon compte'}
            </Button>

            <p className="mt-6 text-center text-sm text-fog">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-volt hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>);

}
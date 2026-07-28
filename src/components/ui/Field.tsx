import React from 'react';
import { cx } from '../../lib/format';

const control =
'w-full rounded-xl border bg-coal/80 px-4 py-3 text-sm text-paper placeholder:text-fog/60 transition-colors focus:border-volt focus:outline-none focus:ring-0';

type WrapProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, error, hint, required, children, className }: WrapProps) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
        {label}
        {required && <span className="ml-1 text-volt">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-fog/70">{hint}</p>}
      {error &&
      <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      }
    </div>);

}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {invalid?: boolean;}>(
  function Input({ className, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cx(control, invalid ? 'border-red-500/60' : 'border-paper/12', className)}
        {...rest} />);


  }
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {invalid?: boolean;}>(
  function Textarea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cx(control, 'min-h-[120px] resize-y', invalid ? 'border-red-500/60' : 'border-paper/12', className)}
        {...rest} />);


  });

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {invalid?: boolean;}>(
  function Select({ className, invalid, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cx(control, 'appearance-none pr-10', invalid ? 'border-red-500/60' : 'border-paper/12', className)}
        {...rest}>
        
      {children}
    </select>);

  });
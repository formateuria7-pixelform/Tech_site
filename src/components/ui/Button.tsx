import React from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/format';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-volt text-ink hover:bg-[#d8ff6d] active:translate-y-px',
  ghost: 'text-paper/80 hover:text-paper hover:bg-paper/5',
  outline: 'border border-paper/20 text-paper hover:border-volt hover:text-volt',
  danger: 'border border-red-500/40 text-red-300 hover:bg-red-500/10'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] rounded-full',
  md: 'h-11 px-5 text-sm rounded-full',
  lg: 'h-14 px-7 text-[15px] rounded-full'
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>);

}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & {to: string;} & Omit<React.ComponentProps<typeof Link>, 'to' | 'className' | 'children'>) {
  return (
    <Link to={to} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>);

}
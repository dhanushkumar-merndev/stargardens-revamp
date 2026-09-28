import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Minimal stand-in for the shadcn/ui Button that Kokonut components import. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      'inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Button.displayName = 'Button';

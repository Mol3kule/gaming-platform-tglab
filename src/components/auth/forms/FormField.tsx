'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.ComponentProps<'input'> {
    label: string;
    error?: string;
    name: string;
    required?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, name, required, className, ...props }, ref) => {
        const hasError = !!error;

        return (
            <div className="space-y-2">
                <Label htmlFor={name} required={required}>
                    {label}
                </Label>
                <Input
                    id={name}
                    name={name}
                    ref={ref}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    className={cn(className)}
                    {...props}
                />
                {hasError && (
                    <p id={`${name}-error`} className="text-sm font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

FormField.displayName = 'FormField';

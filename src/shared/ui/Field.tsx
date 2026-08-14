import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface FieldShellProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs text-ink-muted">{hint}</span> : null}
    </label>
  );
}

const inputBaseClasses =
  "h-9 rounded-md border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 tabular-nums";

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

export function NumberField({ label, hint, value, onChange, className, ...props }: NumberFieldProps) {
  return (
    <FieldShell label={label} hint={hint}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(event.target.valueAsNumber)}
        className={cn(inputBaseClasses, className)}
        {...props}
      />
    </FieldShell>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ label, hint, value, onChange, className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputBaseClasses, className)}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, hint, value, onChange, options, className, ...props }: SelectFieldProps) {
  return (
    <FieldShell label={label} hint={hint}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputBaseClasses, "appearance-none", className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

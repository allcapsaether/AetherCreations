import type { InputHTMLAttributes } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
}

export const inputClass =
  'w-full border border-input bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-luxe'

export function FormField({ label, name, id, ...props }: FormFieldProps) {
  const fieldId = id ?? name
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </label>
      <input id={fieldId} name={name} className={inputClass} {...props} />
    </div>
  )
}

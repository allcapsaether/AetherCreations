import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center border border-foreground font-serif text-sm"
      >
        N
        <span className="sr-only">F</span>
      </span>
      <span className="font-serif text-lg tracking-[0.25em]">
        NOIR<span className="text-luxe">F</span>ORGE
      </span>
    </span>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
        <span className="h-px w-8 bg-luxe" aria-hidden="true" />
        {eyebrow}
      </p>
      <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

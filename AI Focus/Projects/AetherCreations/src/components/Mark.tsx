/** The brand mark: two slanted bars climbing, one shorter. Colors come from CSS. */
export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 2h5L8 22H3z" fill="currentColor" />
      <path d="M18.4 9H23l-3.2 13h-4.6z" fill="var(--mark-accent, var(--azure))" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      {/* Dark plinth after the Paper Archive. id="contact" moved to the
          Correspondence section (Phase 3); the footer closes the page. */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Rishav Raj</p>
        <p>Provenance — The Living Archive</p>
      </div>
    </footer>
  );
}

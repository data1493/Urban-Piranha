export function ShopPage({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
      <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">{kicker}</p>
      <h1 className="font-display mt-2 text-4xl text-up-ink sm:text-5xl">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-up-mute sm:text-base">
        {children}
      </div>
    </main>
  );
}

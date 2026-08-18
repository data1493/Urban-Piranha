export function BackgroundEffects({ variant = "home" }: { variant?: "home" | "results" }) {
  const intensity = variant === "home" ? 1 : 0.35;

  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden="true">
      {variant === "home" && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/bg1.JPG)" }}
        >
          <div className="absolute inset-0 bg-bg/65" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg/40 to-bg" />
      <div className="brick-texture absolute inset-0" style={{ opacity: 0.28 * intensity }} />
      <div
        className="absolute top-0 right-0 h-96 w-96"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, rgba(124, 92, 252, ${0.07 * intensity}) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-80 w-80"
        style={{
          background: `radial-gradient(ellipse at 30% 80%, rgba(232, 168, 56, ${0.05 * intensity}) 0%, transparent 55%)`,
        }}
      />
      {variant === "home" && (
        <div className="absolute right-8 bottom-10 opacity-[0.04]">
          <svg width="180" height="180" viewBox="0 0 200 200" className="text-gold">
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="12" fill="currentColor" />
            <circle cx="100" cy="100" r="4" fill="#0c0c0c" />
          </svg>
        </div>
      )}
    </div>
  );
}

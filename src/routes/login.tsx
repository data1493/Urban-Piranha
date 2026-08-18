import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in · MetaH4" }] }),
});

function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4">
      <div className="w-full max-w-sm space-y-5">
        <Link to="/" className="block">
          <span className="font-display text-3xl text-gold">
            META<span className="text-fg">H</span>
            <span className="font-graffiti text-purple">4</span>
          </span>
        </Link>
        <h1 className="text-xl font-semibold text-fg">Log in / Sign up</h1>
        <p className="text-sm text-muted">Google or X. Same door either way.</p>
        {authEnabled ? (
          <div className="grid gap-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-11 w-full rounded-full border border-line bg-surface text-sm font-medium text-fg hover:border-gold"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <Link to="/" className="block text-sm text-muted hover:text-fg">
          Back home
        </Link>
      </div>
    </main>
  );
}

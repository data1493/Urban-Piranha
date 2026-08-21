import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { UpLogo } from "@/components/shop/UpChrome";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — Urban Piranha" }] }),
});

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0] || "rider",
          callbackURL: "/up/account",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/up/account",
        });
        if (err) throw new Error(err.message);
      }
      window.location.href = "/up/account";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="up-shop grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/up" className="inline-block">
          <UpLogo className="h-12" />
        </Link>
        <h1 className="font-display mt-6 text-4xl text-up-ink">Your account</h1>
        <p className="mt-2 text-sm text-up-mute">
          Orders, sizes, and the next drop. Google, X, or email.
        </p>

        {authEnabled ? (
          <>
            <div className="mt-6 grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/up/account" })}
                  className="h-11 w-full rounded-full border border-up-line bg-white text-sm font-semibold text-up-ink hover:border-up"
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-[11px] font-bold tracking-[0.2em] text-up-mute uppercase">
              or email
            </p>

            <div className="mt-3 flex rounded-full border border-up-line p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("in")}
                className={
                  mode === "in"
                    ? "h-8 flex-1 rounded-full bg-up text-white"
                    : "h-8 flex-1 rounded-full text-up-mute"
                }
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("up")}
                className={
                  mode === "up"
                    ? "h-8 flex-1 rounded-full bg-up text-white"
                    : "h-8 flex-1 rounded-full text-up-mute"
                }
              >
                Create account
              </button>
            </div>

            <form className="mt-4 grid gap-3" onSubmit={submitEmail}>
              {mode === "up" ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="h-11 rounded-full border border-up-line px-4 text-sm outline-none focus:border-up"
                />
              ) : null}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-11 rounded-full border border-up-line px-4 text-sm outline-none focus:border-up"
              />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-11 rounded-full border border-up-line px-4 text-sm outline-none focus:border-up"
              />
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="h-11 rounded-full bg-up text-sm font-semibold text-white hover:bg-up-bright disabled:opacity-60"
              >
                {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
              </button>
            </form>
          </>
        ) : (
          <p className="mt-6 text-sm text-up-mute">Sign-in is disabled.</p>
        )}

        <Link to="/up" className="mt-8 block text-sm text-up-mute hover:text-up-ink">
          Back to shop
        </Link>
      </div>
    </main>
  );
}

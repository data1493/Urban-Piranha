import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/not-found")({
  component: NotFound,
});

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-fg">
      <p className="font-display text-4xl">
        Meta<span className="text-gold">H</span>
        <span className="text-purple">4</span>
      </p>
      <p className="mt-3 text-sm text-muted">Nothing here. The culture moved on.</p>
      <Link to="/" className="mt-4 text-sm text-gold hover:underline">
        Back home
      </Link>
    </main>
  );
}

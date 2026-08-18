export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-16 text-center">
      <p className="font-graffiti text-xl text-purple/80">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

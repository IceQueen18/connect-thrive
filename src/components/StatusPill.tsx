export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-secondary text-secondary-foreground",
    selected: "bg-success text-success-foreground",
    declined: "bg-muted text-muted-foreground",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${map[status] ?? "bg-secondary"}`}>{status}</span>;
}

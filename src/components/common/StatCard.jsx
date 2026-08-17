/** Single metric card used on console dashboards (admin and staff shells). */
export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-console border border-console-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-muted">{label}</span>
        {Icon && <Icon className="size-[18px] text-ink-muted" />}
      </div>
      <span className="font-display text-3xl font-bold text-ink">{value}</span>
    </div>
  );
}

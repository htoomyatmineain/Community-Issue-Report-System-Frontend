import { useLanguage } from "@/app/providers/LanguageProvider";

const DEPARTMENTS = [
  { label: "Electricity", value: 118, barPx: 120 },
  { label: "Roads", value: 146, barPx: 150 },
  { label: "Water", value: 88, barPx: 90 },
  { label: "Sanitation", value: 62, barPx: 64 },
  { label: "Parks", value: 41, barPx: 44 },
  { label: "Buildings", value: 97, barPx: 100 },
];

/** Bar chart of monthly report volume per department, on the staff dashboard. */
export default function DepartmentsChart() {
  const { t } = useLanguage();

  return (
    <div className="flex h-[220px] items-end justify-between gap-4">
      {DEPARTMENTS.map(({ label, value, barPx }) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[11px] font-bold text-ink">{value}</span>
          <div className="w-9 rounded-t-md bg-brand" style={{ height: barPx }} />
          <span className="text-[11px] text-ink-muted">{t(label)}</span>
        </div>
      ))}
    </div>
  );
}

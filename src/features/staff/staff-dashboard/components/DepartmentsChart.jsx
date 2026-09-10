import { useMemo } from "react";
import SimpleBarChart from "@/components/common/SimpleBarChart";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Bar chart of this month's report volume per department, on the staff dashboard. */
export default function DepartmentsChart({ data }) {
  const { t } = useLanguage();
  const localized = useMemo(
    () => (data ?? []).map((d) => ({ ...d, departmentName: t(d.departmentName) })),
    [data, t]
  );
  return <SimpleBarChart data={localized} xKey="departmentName" yKey="reportCount" />;
}

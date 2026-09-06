import SimpleBarChart from "@/components/common/SimpleBarChart";

/** Bar chart of this month's report volume per department, on the staff dashboard. */
export default function DepartmentsChart({ data }) {
  return <SimpleBarChart data={data} xKey="departmentName" yKey="reportCount" />;
}

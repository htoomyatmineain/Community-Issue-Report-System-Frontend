import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useStaffDepartments } from "../hooks/useStaffDepartments";

/** Read-only department directory for staff (write access is Admin-only, see api-standards.md). */
export default function StaffDepartmentsPage() {
  const { departments, isLoading, error } = useStaffDepartments();

  return (
    <div>
      <PageHeader title="Departments" description="Departments handling reports across the city." />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Loading departments…</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : departments.length === 0 ? (
          <EmptyState title="No departments yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Contact email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium text-ink">{dept.name}</TableCell>
                  <TableCell className="text-ink-muted">{dept.description || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{dept.contactEmail || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        dept.active
                          ? "border-none bg-status-resolved-bg text-status-resolved"
                          : "border-none bg-status-closed-bg text-status-closed"
                      }
                    >
                      {dept.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

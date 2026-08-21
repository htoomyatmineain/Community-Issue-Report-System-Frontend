import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import AccountStatusBadge from "@/components/common/AccountStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminStaff } from "../hooks/useAdminStaff";
import CreateStaffDialog from "./CreateStaffDialog";

export default function AdminStaffPage() {
  const { staff, departments, isLoading, error, search, setSearch, create } = useAdminStaff();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleCreate(payload) {
    await create(payload);
    toast.success("Staff account created");
  }

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Government staff accounts, scoped to one department each."
        action={
          <Button onClick={() => setIsDialogOpen(true)} disabled={departments.length === 0}>
            <Plus /> New staff
          </Button>
        }
      />

      <div className="mb-4">
        <label className="flex h-10 w-72 items-center gap-2 rounded-md border border-input bg-background px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </label>
      </div>

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Loading staff…</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : staff.length === 0 ? (
          <EmptyState
            title="No staff accounts yet"
            description="Create a staff account so departments have someone assigned."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-ink">{member.fullName}</TableCell>
                  <TableCell className="text-ink-muted">{member.email}</TableCell>
                  <TableCell className="text-ink-muted">{member.departmentName ?? "—"}</TableCell>
                  <TableCell>
                    <AccountStatusBadge status={member.accountStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CreateStaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        departments={departments}
        onCreate={handleCreate}
      />
    </div>
  );
}

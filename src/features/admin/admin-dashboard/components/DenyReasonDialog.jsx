import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Generic deny-reason dialog shared by the dashboard's two panels (accounts
 * and reports) — ui-rules.md: "Approve / deny dialogs require a reason field
 * when denying." `title`/`description` are the only per-target text.
 */
export default function DenyReasonDialog({ open, onOpenChange, title, description, onDeny }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onDeny(reason.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to deny");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dashboard-deny-reason">Reason *</Label>
            <Textarea
              id="dashboard-deny-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder="Explain why this is being denied…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isSaving || !reason.trim()}>
              {isSaving ? "Denying…" : "Deny"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORY_ICON_OPTIONS, CATEGORY_COLOR_OPTIONS } from "@/lib/constants";
import { useLanguage } from "@/app/providers/LanguageProvider";

const EMPTY_FORM = {
  name: "",
  description: "",
  departmentId: "",
  icon: CATEGORY_ICON_OPTIONS[0].value,
  colorHex: CATEGORY_COLOR_OPTIONS[0],
};

/** Create/edit dialog for a category. `category` null means create. */
export default function CategoryFormDialog({ open, onOpenChange, category, departments, onSave }) {
  const { t } = useLanguage();
  const isEditing = Boolean(category);
  const [form, setForm] = useState(EMPTY_FORM);
  const [active, setActive] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      category
        ? {
            name: category.name ?? "",
            description: category.description ?? "",
            departmentId: category.departmentId != null ? String(category.departmentId) : "",
            icon: category.icon || CATEGORY_ICON_OPTIONS[0].value,
            colorHex: category.colorHex || CATEGORY_COLOR_OPTIONS[0],
          }
        : EMPTY_FORM
    );
    setActive(category ? category.active : true);
    setFieldErrors({});
    setError(null);
  }, [open, category]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const payload = {
        name: form.name,
        description: form.description,
        departmentId: Number(form.departmentId),
        icon: form.icon,
        colorHex: form.colorHex,
        ...(isEditing ? { active } : {}),
      };
      await onSave(payload, category?.id);
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? t("Failed to save category"));
      setFieldErrors(err?.response?.data?.errors ?? {});
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? t("Edit category") : t("New category")}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("Update this category's details.")
              : t("Categories route reports to a department on approval.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-name">{t("Name *")}</Label>
            <Input id="cat-name" name="name" value={form.name} onChange={handleChange} required />
            {fieldErrors.name && <span className="text-xs text-destructive">{fieldErrors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-description">{t("Description")}</Label>
            <Textarea
              id="cat-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            {fieldErrors.description && (
              <span className="text-xs text-destructive">{fieldErrors.description}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-department">{t("Department *")}</Label>
            <Select
              value={form.departmentId}
              onValueChange={(value) => setForm((f) => ({ ...f, departmentId: value }))}
            >
              <SelectTrigger id="cat-department">
                <SelectValue placeholder={t("Select a department")} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)} disabled={!dept.active}>
                    {dept.name}
                    {!dept.active ? ` ${t("(inactive)")}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.departmentId && (
              <span className="text-xs text-destructive">{fieldErrors.departmentId}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-icon">{t("Icon")}</Label>
            <Select value={form.icon} onValueChange={(value) => setForm((f) => ({ ...f, icon: value }))}>
              <SelectTrigger id="cat-icon">
                <SelectValue placeholder={t("Select an icon")} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center gap-2">
                      <opt.icon className="size-4" />
                      {t(opt.label)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-color">{t("Pin colour")}</Label>
            <div className="flex items-center gap-2">
              {CATEGORY_COLOR_OPTIONS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={t("Use colour {hex}", { hex })}
                  onClick={() => setForm((f) => ({ ...f, colorHex: hex }))}
                  className={cn(
                    "size-7 shrink-0 rounded-full border-2",
                    form.colorHex.toLowerCase() === hex.toLowerCase()
                      ? "border-ink"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <Input
                id="cat-color"
                name="colorHex"
                value={form.colorHex}
                onChange={handleChange}
                maxLength={7}
                className="ml-1 w-24 font-mono text-xs uppercase"
                required
              />
            </div>
            {fieldErrors.colorHex && <span className="text-xs text-destructive">{fieldErrors.colorHex}</span>}
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-md border border-console-border px-3 py-2.5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">{t("Active")}</span>
                <span className="text-xs text-ink-muted">
                  {t("Inactive categories no longer appear in the citizen report form.")}
                </span>
              </div>
              <Switch checked={active} onCheckedChange={setActive} aria-label={t("Category active")} />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isSaving || !form.departmentId}>
              {isSaving ? t("Saving…") : isEditing ? t("Save changes") : t("Create category")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

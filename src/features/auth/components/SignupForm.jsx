import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignup } from "../hooks/useSignup";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";
import DateOfBirthPicker from "./DateOfBirthPicker";
import { useLanguage } from "@/app/providers/LanguageProvider";

const TODAY = new Date().toISOString().slice(0, 10);

// Myanmar NRC: <region 1-14>/<township code><(type)><6 digits>, e.g.
// 12/YAKANA(N)123456. Checked against the value uppercased + trimmed.
const NRC_PATTERN = /^([1-9]|1[0-4])\/[A-Z]{3,15}\([A-Z]{1,3}\)\d{6}$/;

// CitizenRegisterDTO on the backend requires every field here except phone
// (which still has to match ^\+?[0-9]{7,15}$ when given). dateOfBirth and
// nrcNumber are mandatory — omitting them is what triggers "Validation failed".
const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", placeholder: "Aung Aung", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+959123456789", autoComplete: "tel" },
  { name: "dateOfBirth", label: "Date of birth", type: "date", autoComplete: "bday", max: TODAY },
  {
    name: "nrcNumber",
    label: "NRC number",
    type: "text",
    placeholder: "12/YAKANA(N)123456",
    autoComplete: "off",
    hint: "Format: 12/YAKANA(N)123456",
  },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

const EMPTY_FORM = Object.fromEntries([...FIELDS.map((f) => [f.name, ""]), ["confirmPassword", ""]]);

/** Public signup — citizens only (Admin and Staff accounts are created by Admin). */
export default function SignupForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { signup, isLoading, error, fieldErrors } = useSignup();

  const confirmMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;
  const dobRequiredError =
    submitAttempted && !form.dateOfBirth ? t("Date of birth is required") : null;

  const nrcNormalised = form.nrcNumber.trim().toUpperCase();
  const nrcFormatError =
    form.nrcNumber.trim().length > 0 && !NRC_PATTERN.test(nrcNormalised)
      ? t("Enter your NRC like 12/YAKANA(N)123456")
      : null;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (form.password !== form.confirmPassword) return;
    if (!form.dateOfBirth) return;
    // Blank is left to `required` + the backend's "NRC is required"; here we
    // only block a non-empty value in the wrong shape.
    if (nrcFormatError) return;

    const { confirmPassword, ...payload } = form;
    signup({ ...payload, nrcNumber: nrcNormalised });
  }

  return (
    <AuthLayout
      headline="Turning every community voice into smarter action."
      description="Report issues, track progress, and help create a community that responds faster, works smarter, and grows stronger."
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] font-bold text-foreground">{t("Create an account")}</h1>
          <p className="text-[13px] text-muted-foreground">{t("Sign up to report issues in your community.")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {FIELDS.map((field) => {
            const fieldError =
              fieldErrors[field.name] ??
              (field.name === "nrcNumber"
                ? nrcFormatError
                : field.name === "dateOfBirth"
                  ? dobRequiredError
                  : null);
            return (
              <label key={field.name} className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-foreground">{t(field.label)}</span>
                {field.type === "password" ? (
                  <PasswordInput
                    name={field.name}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                  />
                ) : field.name === "dateOfBirth" ? (
                  <DateOfBirthPicker
                    id={field.name}
                    value={form.dateOfBirth}
                    max={field.max}
                    invalid={Boolean(fieldError)}
                    onChange={(iso) => setForm((f) => ({ ...f, dateOfBirth: iso }))}
                  />
                ) : (
                  <Input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    max={field.max}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                  />
                )}
                {fieldError ? (
                  <span className="text-xs text-destructive">{fieldError}</span>
                ) : field.hint ? (
                  <span className="text-xs text-muted-foreground">{t(field.hint)}</span>
                ) : null}
              </label>
            );
          })}

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">Confirm password</span>
            <PasswordInput
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {confirmMismatch && <span className="text-xs text-destructive">Passwords do not match</span>}
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={isLoading}>
            {isLoading ? t("Creating account…") : t("Create account")}
          </Button>
        </form>

        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-muted-foreground">{t("Already have an account?")}</span>
          <Link to="/login" className="font-semibold text-primary">
            {t("Log in")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

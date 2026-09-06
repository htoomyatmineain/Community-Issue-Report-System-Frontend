import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignup } from "../hooks/useSignup";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";

const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", placeholder: "Aung Aung", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+959123456789", autoComplete: "tel" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

const EMPTY_FORM = Object.fromEntries([...FIELDS.map((f) => [f.name, ""]), ["confirmPassword", ""]]);

/** Public signup — citizens only (Admin and Staff accounts are created by Admin). */
export default function SignupForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const { signup, isLoading, error, fieldErrors } = useSignup();

  const confirmMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    const { confirmPassword, ...payload } = form;
    signup(payload);
  }

  return (
    <AuthLayout
      headline="Turning every community voice into smarter action."
      description="Report issues, track progress, and help create a community that responds faster, works smarter, and grows stronger."
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] font-bold text-foreground">Create an account</h1>
          <p className="text-[13px] text-muted-foreground">Sign up to report issues in your community.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {FIELDS.map((field) => (
            <label key={field.name} className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-foreground">{field.label}</span>
              {field.type === "password" ? (
                <PasswordInput
                  name={field.name}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <Input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                />
              )}
              {fieldErrors[field.name] && (
                <span className="text-xs text-destructive">{fieldErrors[field.name]}</span>
              )}
            </label>
          ))}

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
            {isLoading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-muted-foreground">Already have an account?</span>
          <Link to="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

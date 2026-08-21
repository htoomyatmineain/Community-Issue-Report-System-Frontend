import { useState } from "react";
import { Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignup } from "../hooks/useSignup";

const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", placeholder: "Aung Aung", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+959123456789", autoComplete: "tel" },
  { name: "dateOfBirth", label: "Date of birth", type: "date", autoComplete: "bday" },
  { name: "nrcNumber", label: "NRC number", type: "text", placeholder: "12/ABC(N)123456" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
];

const EMPTY_FORM = Object.fromEntries(FIELDS.map((f) => [f.name, ""]));

/** Public signup — citizens only (Admin and Staff accounts are created by Admin). */
export default function SignupForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const { signup, isLoading, error, fieldErrors } = useSignup();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    signup(form);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Landmark className="h-10 w-10 text-primary" />
          <h1 className="font-display text-[22px] font-bold text-foreground">Create your account</h1>
          <p className="w-[280px] text-center text-[13px] text-muted-foreground">
            Sign up to report issues in your community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {FIELDS.map((field) => (
            <label key={field.name} className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-foreground">{field.label}</span>
              <Input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
              {fieldErrors[field.name] && (
                <span className="text-xs text-destructive">{fieldErrors[field.name]}</span>
              )}
            </label>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
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
    </div>
  );
}

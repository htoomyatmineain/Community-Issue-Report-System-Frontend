import { useState } from "react";
import { Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSignup } from "../hooks/useSignup";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";

const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", placeholder: "Aung Aung", autoComplete: "name", span: "full" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email", span: "full" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+959123456789", autoComplete: "tel", span: "half" },
  { name: "dateOfBirth", label: "Date of birth", type: "date", autoComplete: "bday", span: "half" },
  { name: "nrcNumber", label: "NRC number", type: "text", placeholder: "12/ABC(N)123456", span: "full" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password", span: "full" },
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
    <AuthLayout
      eyebrow="Smart Community Issue Report System"
      headline="Get access to your community hub — report issues and see them through to resolution."
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Landmark className="h-7 w-7 text-primary" />
          <h1 className="font-display text-[26px] font-bold text-foreground">Create an account</h1>
          <p className="text-[13px] text-muted-foreground">Sign up to report issues in your community.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <label
              key={field.name}
              className={cn("flex flex-col gap-1.5", field.span === "full" && "sm:col-span-2")}
            >
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

          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-base sm:col-span-2"
            disabled={isLoading}
          >
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

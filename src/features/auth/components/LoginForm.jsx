import { useState } from "react";
import { Landmark } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLE_HOME_PATH } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../hooks/useLogin";
import { DEMO_CITIZEN_USER } from "../dev/demoCitizenSession";
import { DEMO_STAFF_USER } from "../dev/demoStaffSession";
import { DEMO_ADMIN_USER } from "../dev/demoAdminSession";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";

const DEMO_USERS = [
  { label: "Continue as Citizen (Demo)", user: DEMO_CITIZEN_USER },
  { label: "Continue as Staff (Demo)", user: DEMO_STAFF_USER },
  { label: "Continue as Admin (Demo)", user: DEMO_ADMIN_USER },
];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const location = useLocation();

  // DEMO_LOGIN — dev-only bypass while there's no seeded backend account to
  // test against. See src/features/auth/dev/demo*Session.js. Never shipped:
  // gated by import.meta.env.DEV below, stripped from prod builds.
  const { login: setSession } = useAuth();
  const navigate = useNavigate();
  function continueAsDemo(user) {
    setSession(user);
    navigate(ROLE_HOME_PATH[user.role] ?? "/");
  }

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <AuthLayout
      eyebrow="Smart Community Issue Report System"
      headline="Report issues, track their progress, and help your community move forward."
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Landmark className="h-7 w-7 text-primary" />
          <h1 className="font-display text-[26px] font-bold text-foreground">Welcome back</h1>
          <p className="text-[13px] text-muted-foreground">
            Log in to SCIRS to report and track community issues.
          </p>
        </div>

        {location.state?.justRegistered && (
          <p className="w-full rounded-md bg-status-resolved-bg px-3 py-2 text-center text-[13px] text-status-resolved">
            Account created — it's pending admin approval before you can log in.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">Email</span>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">Password</span>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={isLoading}>
            {isLoading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        {import.meta.env.DEV && (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or, for development
              <span className="h-px flex-1 bg-border" />
            </div>
            {DEMO_USERS.map(({ label, user }) => (
              <Button
                key={user.role}
                type="button"
                variant="outline"
                className="w-full rounded-full border-dashed"
                onClick={() => continueAsDemo(user)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-muted-foreground">New citizen?</span>
          <Link to="/signup" className="font-semibold text-primary">
            Create account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

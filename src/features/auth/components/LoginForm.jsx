import { useState } from "react";
import { Landmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../hooks/useLogin";
import { DEMO_CITIZEN_USER } from "../dev/demoCitizenSession";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  // DEMO_LOGIN — dev-only bypass while there's no seeded backend account to
  // test against. See src/features/auth/dev/demoCitizenSession.js. Never
  // shipped: gated by import.meta.env.DEV below, stripped from prod builds.
  const { login: setSession } = useAuth();
  const navigate = useNavigate();
  function continueAsDemoCitizen() {
    setSession(DEMO_CITIZEN_USER);
    navigate("/");
  }

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Landmark className="h-10 w-10 text-primary" />
          <h1 className="font-display text-[22px] font-bold text-foreground">SCIRS</h1>
          <p className="w-[260px] text-center text-[13px] text-muted-foreground">
            Smart Community Issue Report System
          </p>
        </div>

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
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
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
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={continueAsDemoCitizen}
            >
              Continue as Citizen (Demo)
            </Button>
          </div>
        )}

        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-muted-foreground">New citizen?</span>
          <Link to="/signup" className="font-semibold text-primary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

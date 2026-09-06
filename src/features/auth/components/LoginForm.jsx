import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../hooks/useLogin";
import AuthLayout from "./AuthLayout";
import GoogleSignInButton from "./GoogleSignInButton";
import PasswordInput from "./PasswordInput";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle, isLoading, error } = useLogin();
  const location = useLocation();

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <AuthLayout
      headline="Turning every community voice into smarter action."
      description="Report issues, track progress, and help create a community that responds faster, works smarter, and grows stronger."
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] font-bold text-foreground">{t("Welcome back")}</h1>
          <p className="text-[13px] text-muted-foreground">
            {t("Ready to make changes for your community?")}
          </p>
        </div>

        {location.state?.justRegistered && (
          <p className="w-full rounded-md bg-status-resolved-bg px-3 py-2 text-center text-[13px] text-status-resolved">
            {t("Account created — it's pending admin approval before you can log in.")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">{t("Email")}</span>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">{t("Password")}</span>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={isLoading}>
            {isLoading ? t("Loading…") : t("Log in")}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[12px] text-muted-foreground">Or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleSignInButton onCredential={loginWithGoogle} disabled={isLoading} />

        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-muted-foreground">{t("New citizen?")}</span>
          <Link to="/signup" className="font-semibold text-primary">
            {t("Create account")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

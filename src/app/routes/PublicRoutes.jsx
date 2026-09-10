import { Route } from "react-router-dom";
import { LoginForm, SignupForm } from "@/features/auth";
import { LandingPage } from "@/features/landing";

/** Unauthenticated routes: public landing page + login/signup. */
export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </>
  );
}

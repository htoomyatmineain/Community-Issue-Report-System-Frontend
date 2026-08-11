import { Route } from "react-router-dom";
import { LoginForm, SignupForm } from "@/features/auth";

/** Unauthenticated routes: login/signup. */
export default function PublicRoutes() {
  return (
    <>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </>
  );
}

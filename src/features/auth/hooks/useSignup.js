import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

/** Public signup flow — citizens only. POSTs CitizenRegisterDTO to /auth/register. */
export function useSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function signup(payload) {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      await authApi.signup(payload);
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setError(err?.response?.data?.message ?? "Signup failed");
      setFieldErrors(err?.response?.data?.errors ?? {});
    } finally {
      setIsLoading(false);
    }
  }

  return { signup, isLoading, error, fieldErrors };
}

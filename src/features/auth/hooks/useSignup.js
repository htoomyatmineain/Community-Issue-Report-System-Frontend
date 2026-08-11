import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

/** Public signup flow — citizens only. */
export function useSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function signup(payload) {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.signup(payload);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return { signup, isLoading, error };
}

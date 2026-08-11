import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { authApi } from "../api/authApi";

export function useLogin() {
  const { login: setSession } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(credentials) {
    setIsLoading(true);
    setError(null);
    try {
      const { data: user } = await authApi.login(credentials);
      setSession(user);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}

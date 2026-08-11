import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

/** Public signup — citizens only (Admin and Staff accounts are created by Admin). */
export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { signup, isLoading, error } = useSignup();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    signup(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={isLoading}>
        Sign up
      </button>
    </form>
  );
}

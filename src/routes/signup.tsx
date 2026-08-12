import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "./login";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    nav({ to: "/onboarding" });
  }

  return (
    <AuthShell
      title="Start your free trial"
      subtitle="14 days, full access, no credit card."
      cta="Create account"
      loading={loading}
      error={error}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      altLink="/login"
      altText="Already have an account? Sign in"
    />
  );
}

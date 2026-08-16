import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "./login";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/track";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Start free trial — TaxScout" },
      { name: "description", content: "Start your 14-day TaxScout trial. No credit card required." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    track("signup_started");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    track("signup_completed");
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

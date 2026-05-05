import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const nav = useNavigate();
  return <AuthShell title="Start your free trial" subtitle="14 days, full access, no credit card." cta="Create account" onSubmit={() => nav({ to: "/onboarding" })} altLink="/login" altText="Already have an account? Sign in" />;
}

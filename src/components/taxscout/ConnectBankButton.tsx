import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { authedFetch } from "@/lib/supabase";

export function ConnectBankButton({ onConnected }: { onConnected: () => void }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "syncing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedFetch("/api/plaid/create-link-token", { method: "POST" })
      .then((r) => r.json())
      .then((data: { link_token?: string }) => setLinkToken(data.link_token ?? null))
      .catch(() => setError("Couldn't reach bank connection service."));
  }, []);

  const onSuccess = useCallback(
    async (publicToken: string | null, metadata: { institution: { name: string } | null }) => {
      if (!publicToken) return;
      setStatus("loading");
      setError(null);
      try {
        const exchangeRes = await authedFetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken, institution_name: metadata.institution?.name }),
        });
        if (!exchangeRes.ok) throw new Error("Failed to link account.");

        setStatus("syncing");
        const syncRes = await authedFetch("/api/plaid/sync", { method: "POST" });
        if (!syncRes.ok) throw new Error("Linked, but the first sync failed.");

        setStatus("idle");
        onConnected();
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    },
    [onConnected],
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  const busy = status === "loading" || status === "syncing";
  const isSandbox = import.meta.env.VITE_PLAID_ENV !== "production";

  return (
    <div>
      {isSandbox && (
        <p className="mb-2 text-xs text-warning">
          Test mode — real banks aren't connectable yet. Use Plaid's sample "First Platypus Bank" login to try this out.
        </p>
      )}
      <Button
        variant="outline"
        className="w-full"
        disabled={!ready || !linkToken || busy}
        onClick={() => open()}
      >
        <Building2 className="mr-2 h-4 w-4" />
        {status === "loading" ? "Linking account…" : status === "syncing" ? "Importing transactions…" : "+ Connect a bank account"}
      </Button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

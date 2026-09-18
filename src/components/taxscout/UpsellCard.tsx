import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UpsellCard({ feature, description }: { feature: string; description: string }) {
  return (
    <Card className="mx-auto max-w-md p-8 text-center">
      <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">{feature} is a paid feature</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      <Link to="/settings" hash="billing" className="mt-5 inline-block">
        <Button>View plans</Button>
      </Link>
    </Card>
  );
}

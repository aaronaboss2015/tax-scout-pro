import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/taxscout/Logo";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TaxScout" },
      { name: "description", content: "TaxScout is built and run by one person — a freelancer who didn't understand the tax side of the job and built the tool he needed." },
      { property: "og:url", content: "https://taxscout.dev/about" },
    ],
    links: [{ rel: "canonical", href: "https://taxscout.dev/about" }],
  }),
  component: About,
});

function About() {
  useEffect(() => {
    track("about_page_view");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold tracking-tight">TaxScout</span>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start free trial
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About TaxScout</h1>
        <p className="mt-2 text-muted-foreground">Built by one person — because I needed it myself.</p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground">
          <p>
            I'm Aaron. A few years ago I started freelancing and had no real idea how to handle the tax side of it.
            Nobody warns you about quarterly payments, what actually counts as a deduction, or how fast the math gets
            confusing when your income isn't a steady paycheck. I ended up guessing — and probably got it wrong more
            than once.
          </p>
          <p>
            TaxScout is the tool I wish had existed back then. It connects to your accounts, flags what looks
            deductible, and shows you the actual reasoning behind each match — not a black-box guess — so you can
            check its work instead of just trusting it. Nothing gets exported or filed without you approving it
            first.
          </p>
          <p>
            Right now, it's just me building and running this — no support team, no sales team. That means things
            move a little slower than they would at a bigger company, but it also means if something's wrong, I
            actually want to hear about it, and I'm the one who fixes it.
          </p>
          <p>
            Have a question, found a bug, or think a transaction got categorized wrong? Email me directly at{" "}
            <a href="mailto:hello@taxscout.dev" className="text-primary underline underline-offset-2">
              hello@taxscout.dev
            </a>
            .
          </p>
        </div>

        <Link to="/signup" className="mt-10 inline-block">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start your free trial <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

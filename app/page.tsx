import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">LawnFrontend</h1>
      <p className="text-muted-foreground max-w-md">
        Start by reading <code className="bg-muted rounded px-1 py-0.5">README.md</code>{" "}
        for the project structure and conventions, then check out the reference feature
        below.
      </p>
      <Button render={<Link href="/example-todos" />}>View example feature</Button>
    </main>
  );
}

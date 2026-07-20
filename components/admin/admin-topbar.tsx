"use client";

import { useState } from "react";
import { Search, UserPlus } from "lucide-react";

export function AdminTopbar({ onInvite }: { onInvite: () => void }) {
  const [search, setSearch] = useState("");

  return (
    <header className="border-border bg-background/85 sticky top-0 z-20 flex items-center gap-6 border-b px-8 py-5 backdrop-blur">
      <div className="shrink-0">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
          Welcome back, Alex
        </h1>
        <p className="text-muted-foreground text-[13px]">Monday, June 29, 2026</p>
      </div>

      <div className="relative mx-auto hidden max-w-[520px] flex-1 md:block">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents, bookings, customers…"
          className="border-input bg-background focus:border-ring h-11 w-full rounded-[10px] border pr-11 pl-10 text-sm outline-none"
        />
        <span className="text-muted-foreground border-border absolute top-1/2 right-3 -translate-y-1/2 rounded-md border px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </span>
      </div>

      <button
        type="button"
        onClick={onInvite}
        className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] px-[18px] text-sm font-medium transition-colors md:ml-0"
      >
        <UserPlus className="size-[17px]" />
        Invite Agent
      </button>
    </header>
  );
}

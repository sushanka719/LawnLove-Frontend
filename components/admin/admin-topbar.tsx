"use client";

import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";

export function AdminTopbar({ onInvite }: { onInvite: () => void }) {
  const [search, setSearch] = useState("");

  return (
    <header className="flex flex-wrap items-center gap-4 pt-1">
      <div className="shrink-0">
        <h1 className="text-primary text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground text-sm">Monday, June 29, 2026</p>
      </div>

      <div className="ml-auto flex items-center gap-3 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary/50 h-12 w-[240px] rounded-[10px] border pr-4 pl-11 text-sm outline-none transition-colors lg:w-[380px]"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="border-border bg-card text-muted-foreground hover:text-foreground flex size-12 shrink-0 items-center justify-center rounded-[10px] border transition-colors"
        >
          <Bell className="size-[22px]" />
        </button>

        <button
          type="button"
          onClick={onInvite}
          className="lawn-gradient-btn inline-flex h-12 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98]"
        >
          <Plus className="size-[18px]" />
          Invite agent
        </button>
      </div>
    </header>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTodos } from "../api";
import { useTodoUiStore, type TodoFilter } from "../store";

const filters: TodoFilter[] = ["all", "active", "completed"];

export function TodoList() {
  const { data: todos, isLoading, isError } = useTodos();
  const { filter, setFilter } = useTodoUiStore();

  const visibleTodos = todos?.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && <p className="text-destructive text-sm">Failed to load todos.</p>}

      <ul className="flex flex-col gap-2">
        {visibleTodos?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span className={cn(todo.completed && "text-muted-foreground line-through")}>
              {todo.title}
            </span>
            <Badge variant={todo.completed ? "secondary" : "default"}>
              {todo.completed ? "done" : "active"}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

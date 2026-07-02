import { TodoForm, TodoList } from "@/features/example-todos";

export default function ExampleTodosPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Example: Todos</h1>
        <p className="text-muted-foreground text-sm">
          Reference feature showing zustand + React Query + zod + react-hook-form +
          shadcn/ui wired together. See{" "}
          <code className="bg-muted rounded px-1 py-0.5">features/example-todos</code> for
          the source — copy this folder as a starting point for new features.
        </p>
      </div>
      <TodoForm />
      <TodoList />
    </div>
  );
}

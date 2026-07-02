import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTodoInput, Todo } from "./schema";

/**
 * Stand-in for a real backend so this feature runs with zero setup.
 * Swap the body of these two functions for `apiClient.get/post(...)` calls
 * once a real `/todos` endpoint exists — the hooks below don't need to change.
 */
let mockTodos: Todo[] = [
  { id: "1", title: "Read the project README", completed: true },
  { id: "2", title: "Wire up your first feature", completed: false },
];

async function fetchTodos(): Promise<Todo[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTodos;
}

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const todo: Todo = { id: crypto.randomUUID(), title: input.title, completed: false };
  mockTodos = [...mockTodos, todo];
  return todo;
}

export const todoKeys = {
  all: ["todos"] as const,
};

export function useTodos() {
  return useQuery({
    queryKey: todoKeys.all,
    queryFn: fetchTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

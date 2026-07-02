"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCreateTodo } from "../api";
import { createTodoSchema, type CreateTodoInput } from "../schema";

export function TodoForm() {
  const createTodo = useCreateTodo();
  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "" },
  });

  function onSubmit(values: CreateTodoInput) {
    createTodo.mutate(values, {
      onSuccess: () => {
        form.reset();
        toast.success("Todo added");
      },
      onError: () => {
        toast.error("Could not add todo");
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">New todo</FieldLabel>
          <Input id="title" placeholder="What needs doing?" {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
        </Field>
        <Button type="submit" disabled={createTodo.isPending}>
          {createTodo.isPending ? "Adding..." : "Add todo"}
        </Button>
      </FieldGroup>
    </form>
  );
}

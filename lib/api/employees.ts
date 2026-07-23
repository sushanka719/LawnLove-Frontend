import { http } from "@/lib/api/http";

// Agent crew members — backend EmployeesController (@Roles(['agent'])), scoped to
// the signed-in agent. `dailyCap` + `active` are the scheduler's only capacity
// knobs, so these directly control how visits get assigned.

export type Employee = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  dailyCap: number;
  active: boolean;
  createdAt: string;
  jobsCount: number;
};

export type CreateEmployeeInput = {
  name: string;
  phone?: string;
  email?: string;
  dailyCap?: number;
  active?: boolean;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export function getEmployees() {
  return http.get<Employee[]>("/agent/employees");
}

export function createEmployee(body: CreateEmployeeInput) {
  return http.post<Employee>("/agent/employees", body);
}

export function updateEmployee(id: string, body: UpdateEmployeeInput) {
  return http.patch<Employee>(`/agent/employees/${id}`, body);
}

export function deleteEmployee(id: string) {
  return http.delete<{ success: boolean }>(`/agent/employees/${id}`);
}

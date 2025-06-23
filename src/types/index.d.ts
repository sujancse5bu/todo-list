import type { Statuses } from "./status";

export type Status = typeof Statuses[keyof typeof Statuses];

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: Status
  dueDate?: Date;
}


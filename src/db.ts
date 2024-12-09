import type { Task } from "./types";

export function getTasks(): Task[] {
  return Array.from({ length: 10 }, (_, index) => ({ id: `id:${index}` }));
}

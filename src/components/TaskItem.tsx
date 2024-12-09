import type { Task } from "../types";

export function TaskItem({ task }: { task: Task }) {
  return (
    <div className="birder rounded p-2 hover:cursor-grab hover:bg-gray-200">
      Item: {task.id}
    </div>
  );
}

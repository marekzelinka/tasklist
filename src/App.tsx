import { useState } from "react";
import { TaskItem } from "./components/TaskItem";
import { getTasks } from "./db";

export default function TaskList() {
  const [tasks, setTasks] = useState(() => getTasks());

  return (
    <div className="mx-auto max-w-lg p-10">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <div className="mt-8 grid gap-1 rounded border p-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

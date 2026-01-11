import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{ tasks { id title completed } }`,
        }),
      });
      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setTasks(data.data.tasks);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    const title = prompt("Task?");
    const trimmedTitle = title ? title.trim() : "";
    if (!trimmedTitle) {
      return;
    }

    try {
      setIsMutating(true);
      const response = await fetch("/api/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: "mutation CreateTask($title: String!) { createTask(title: $title) { id title completed } }",
          variables: { title: trimmedTitle },
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      await fetchTasks();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
    } finally {
      setIsMutating(false);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      setIsMutating(true);
      const response = await fetch("/api/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: "mutation ToggleTask($id: ID!) { toggleTask(id: $id) { id completed } }",
          variables: { id },
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      await fetchTasks();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle task";
      setError(errorMessage);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div>
      <h1>Tasks</h1>
      <p>Click to complete the task</p>
      {error && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          Error: {error}
        </div>
      )}
      <button onClick={addTask} disabled={isMutating}>
        {isMutating ? "Loading..." : "Add"}
      </button>

      {isLoading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>Loading tasks...</div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => !isMutating && toggleTask(task.id)}
            style={{ cursor: isMutating ? "not-allowed" : "pointer", opacity: isMutating ? 0.6 : 1 }}
          >
            {task.title} — {task.completed ? "Done" : "Pending"}
          </div>
        ))
      )}
    </div>
  );
}

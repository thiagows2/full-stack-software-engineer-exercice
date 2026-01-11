import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
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
    }
  };

  const toggleTask = async (id: string) => {
    try {
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
      <button onClick={addTask}>Add</button>

      {tasks?.map((t: any) => (
        <div
          key={t.id}
          onClick={() => toggleTask(t.id)}
          style={{ cursor: "pointer" }}
        >
          {t.title} — {t.completed ? "Done" : "Pending"}
        </div>
      ))}
    </div>
  );
}

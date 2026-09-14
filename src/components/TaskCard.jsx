import { useState } from "react";
import { api } from "../services/api";

export default function TaskCard({
  task,
  onCompleted,
}) {
  const [done, setDone] = useState(
    task.status === "completed" ||
    task.done === true
  );

  const [loading, setLoading] =
    useState(false);

  const taskType =
    task.type || "LEARN";

  const level =
    task.level ||
    task.difficulty ||
    taskType;

  const courseName =
    typeof task.course === "object"
      ? task.course?.title
      : task.course;

  const displayCourse =
    courseName ||
    task.courseTitle ||
    "LearnFlow";

  const duration =
    task.duration ||
    (task.estimatedMinutes
      ? `${task.estimatedMinutes} min`
      : "");

  const handleComplete = async () => {
    if (done || loading) {
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "learnflow_token"
        );

      if (!token) {
        alert(
          "Please sign in to complete this task."
        );
        return;
      }

      const data = await api.post(`/tasks/${task.id}/complete`, {});

      if (data.success) {
        setDone(true);

        if (typeof onCompleted === "function") {
          await onCompleted(task.id);
        }
      }
    } catch (error) {
      console.error(
        "Failed to complete task:",
        error
      );

      alert(
        error.message ||
        "Failed to complete task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`task-card ${done ? "completed" : ""
        }`}
    >
      <button
        className={`task-check ${done ? "checked" : ""
          }`}
        onClick={handleComplete}
        disabled={loading || done}
        aria-label={
          done
            ? "Task completed"
            : "Complete task"
        }
      >
        {loading
          ? "…"
          : done
            ? "✓"
            : ""}
      </button>

      <div className="task-main">
        <div className="task-title">
          {task.title}
        </div>

        <div className="task-meta">
          {displayCourse}

          {duration &&
            ` · ${duration}`}
        </div>
      </div>

      <span
        className={`difficulty ${String(
          level
        ).toLowerCase()}`}
      >
        {level}
      </span>
    </div>
  );
}
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  // Real database values
  const category =
    course.type ||
    course.category ||
    "Academic";

  const modules = Array.isArray(course.modules)
    ? course.modules
    : [];

  const tasks = Array.isArray(course.tasks)
    ? course.tasks
    : [];

  // Count completed tasks
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const totalTasks = tasks.length;

  // Calculate progress
  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // Use modules as lessons when no tasks exist
  const lessonCount =
    totalTasks > 0
      ? totalTasks
      : modules.length;

  const completedLessons =
    totalTasks > 0
      ? completedTasks
      : 0;

  // Duration
  const duration = course.duration
    ? `${course.duration} min`
    : null;

  const difficulty =
    course.difficulty || null;

  return (
    <div
      className={`course-card ${course.color || ""}`}
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="course-card-top">
        <span className="course-category">
          {category}
        </span>

        <button
          className="course-arrow"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${course.id}`);
          }}
        >
          ↗
        </button>
      </div>

      <h3>{course.title}</h3>

      <p>
        {course.description ||
          "Start learning this course and build your knowledge step by step."}
      </p>

      <div className="course-meta">
        {difficulty && (
          <span>{difficulty}</span>
        )}

        {duration && (
          <span>{duration}</span>
        )}

        <span>
          {modules.length}{" "}
          {modules.length === 1 ? "module" : "modules"}
        </span>
      </div>

      <div className="course-progress-row">
        <span>
          {completedLessons}/{lessonCount} lessons
        </span>

        <strong>{progress}%</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
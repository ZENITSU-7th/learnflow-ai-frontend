import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import TaskCard from "../components/TaskCard";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [courseData, taskData] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/tasks/course/${id}`),
      ]);
      setCourse(courseData.course);
      setTasks(taskData.tasks || []);
    } catch (e) {
      setError(e.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const allResources = useMemo(
    () => (course?.modules || []).flatMap((m) => (m.resources || []).map((mr) => mr.resource)).filter(Boolean),
    [course]
  );

  const runAction = async (name, fn) => {
    try {
      setWorking(name);
      setError("");
      setMessage("");
      const data = await fn();
      setMessage(data.message || "Action completed successfully.");
      await load();
    } catch (e) {
      setError(e.message || "Action failed.");
    } finally {
      setWorking("");
    }
  };

  if (loading) return <div className="page"><div className="empty-state">Loading course...</div></div>;
  if (error && !course) return <div className="page"><div className="empty-state"><h3>Unable to load course</h3><p>{error}</p><button className="primary-button" onClick={() => navigate("/courses")}>Back to Courses</button></div></div>;
  if (!course) return null;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  

  return (
    <div className="page">
      <div className="page-intro">
        <button className="filter" onClick={() => navigate("/courses")}>← Back to Courses</button>
        <div style={{ marginTop: 24 }}>
          <span className="section-kicker">{course.type || "ACADEMIC"}</span>
          <h1>{course.title}</h1>
          <p>{course.description || "Your personalized learning course."}</p>
        </div>
      </div>

      <div className="course-meta">
        {course.difficulty && <span>Difficulty: {course.difficulty}</span>}
        {course.duration && <span>Estimated: {course.duration} min</span>}
        <span>{course.modules?.length || 0} modules</span>
        <span>{completedTasks}/{tasks.length} tasks complete</span>
      </div>

      {(message || error) && (
        <div className="panel" style={{ marginTop: 20 }}>
          <p style={{ margin: 0 }}>{message || error}</p>
        </div>
      )}

      <div className="panel" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <span className="section-kicker">LEARNING ENGINE</span>
            <h2 style={{ marginTop: 6 }}>Turn this course into a study plan</h2>
            <p>Generate realistic tasks, schedule them, and test your knowledge.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button className="secondary-button" disabled={!!working} onClick={() => runAction("tasks", () => api.post(`/tasks/course/${id}/generate`))}>
              {working === "tasks" ? "Generating..." : "Generate tasks"}
            </button>
            <button className="secondary-button" disabled={!!working || tasks.length === 0} onClick={() => runAction("schedule", () => api.post("/tasks/schedule", { courseId: Number(id) }))}>
              {working === "schedule" ? "Scheduling..." : "Schedule tasks"}
            </button>
            {allResources.length > 0 && (
              <button className="primary-button" disabled={!!working} onClick={async () => {
                try {
                  setWorking("quiz");
                  const data = await api.post("/quizzes/generate", {
                    courseId: Number(id),
                    difficulty: course.difficulty === "BEGINNER" ? "EASY" : "MEDIUM",
                    numberOfQuestions: 3,
                  });
                  navigate(`/quiz/${data.quiz.id}`);
                } catch (e) {
                  setError(e.message || "Quiz generation failed.");
                } finally {
                  setWorking("");
                }
              }}>
                {working === "quiz" ? "Creating quiz..." : "Take AI quiz"}
              </button>
            )}
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Course progress</span><strong>{progress}%</strong>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <span className="section-kicker">COURSE SYLLABUS</span>
        <h2 style={{ marginTop: 8 }}>Learning Modules</h2>
      </div>

      <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
        {(course.modules || []).map((module) => {
          const moduleTasks = tasks.filter((t) => Number(t.moduleId) === Number(module.id));
          const done = moduleTasks.filter((t) => t.status === "completed").length;
          const moduleProgress = moduleTasks.length ? Math.round((done / moduleTasks.length) * 100) : 0;
          return (
            <section className="course-card" key={module.id}>
              <div className="course-card-top">
                <span className="course-category">MODULE {module.order}</span>
                {module.difficulty && <span className="course-category">{module.difficulty}</span>}
              </div>
              <h3>{module.title}</h3>
              {module.description && <p>{module.description}</p>}

              <div style={{ marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span>Module progress</span><strong>{moduleProgress}%</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${moduleProgress}%` }} /></div>
              </div>

              <div style={{ marginTop: 24 }}>
                <strong>Resources</strong>
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  {(module.resources || []).map((mr) => (
                    <a key={mr.resource.id} href={mr.resource.url || "#"} target="_blank" rel="noreferrer" style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,.04)" }}>
                      {mr.resource.title}
                    </a>
                  ))}
                  {(module.resources || []).length === 0 && <p>No resources assigned yet.</p>}
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <strong>Learning tasks</strong>
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  {moduleTasks.map((task) => <TaskCard key={task.id} task={task} onCompleted={load} />)}
                  {moduleTasks.length === 0 && <p>No tasks yet. Use Generate tasks above.</p>}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

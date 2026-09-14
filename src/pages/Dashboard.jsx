import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import CourseCard from "../components/CourseCard";
import StatCard from "../components/StatCard";
import api from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState([]);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("learnflow_token");

      if (!token) {
        setDashboard(null);
        return;
      }

      const data = await api.get("/dashboard");

      if (data.success) {
        setDashboard(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdaptiveRecommendations = async () => {
    try {
      const token = localStorage.getItem("learnflow_token");

      if (!token) {
        setAdaptiveRecommendations([]);
        return;
      }

      const data = await api.get("/adaptive-recommendations");

      if (data.success) {
        setAdaptiveRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error(
        "Failed to load adaptive recommendations:",
        error
      );
    }
  };

  useEffect(() => {
    loadDashboard();
    loadAdaptiveRecommendations();
  }, []);

  const handleTaskCompleted = async () => {
    await loadDashboard();
    await loadAdaptiveRecommendations();
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="dashboard-loading">
          Loading your learning progress...
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="page-content">
        <div className="dashboard-empty">
          <h2>Welcome to LearnFlow AI 👋</h2>
          <p>
            Please sign in to view your learning dashboard.
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboard.stats || {};

  const todayTasks = dashboard.todayTasks || [];
  const pendingTasks = (dashboard.tasks || []).filter((task) => task.status !== "completed");
  const visibleTasks = todayTasks.length > 0 ? todayTasks : pendingTasks.slice(0, 5);

  const courses = dashboard.courses || [];

  const resources = dashboard.resources || [];

  const weeklyActivity =
    dashboard.weeklyActivity?.weeklyActivity || [];

  const activeDays =
    dashboard.weeklyActivity?.activeDays || 0;

  const currentStreak =
    dashboard.streak?.current ??
    stats.currentStreak ??
    0;

  const longestStreak =
    dashboard.streak?.longest ??
    stats.longestStreak ??
    0;

  return (
    <div className="page-content dashboard-page">

      {/* HEADER */}

      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            YOUR LEARNING DASHBOARD
          </p>

          <h1>
            Good day, {dashboard.user?.name || "Learner"} 👋
          </h1>

          <p className="dashboard-description">
            Here is your real learning progress from LearnFlow AI.
          </p>
        </div>
      </section>


      {/* STATS */}

      <section className="stats-grid">

        <StatCard
          title="Active Courses"
          value={stats.totalCourses ?? 0}
          subtitle="Courses you're learning"
        />

        <StatCard
          title="Total Tasks"
          value={stats.totalTasks ?? 0}
          subtitle={`${stats.completedTasks ?? 0} completed`}
        />

        <StatCard
          title="Course Completion"
          value={`${stats.completion ?? 0}%`}
          subtitle="Overall learning progress"
        />

        <StatCard
          title="Learning Time"
          value={`${stats.learningTimeMinutes ?? 0}m`}
          subtitle="Total focused learning"
        />

        <StatCard
          title="Quiz Attempts"
          value={stats.totalQuizzes ?? 0}
          subtitle="Knowledge assessments"
        />

        <StatCard
          title="Average Quiz Score"
          value={`${stats.averageQuizScore ?? 0}%`}
          subtitle="Across all quizzes"
        />

        <StatCard
          title="Latest Quiz Score"
          value={`${stats.latestQuizScore ?? 0}%`}
          subtitle="Most recent assessment"
        />

        <StatCard
          title="Learning Streak 🔥"
          value={`${currentStreak} ${currentStreak === 1 ? "day" : "days"
            }`}
          subtitle={`Longest: ${longestStreak} ${longestStreak === 1 ? "day" : "days"
            }`}
        />

      </section>


      {/* WEEKLY ACTIVITY */}

      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>Weekly Activity</h2>

            <p>
              You learned on {activeDays} of the last 7 days.
            </p>
          </div>
        </div>

        <div className="weekly-activity-card">

          <div
            className="weekly-activity-days"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "12px",
            }}
          >

            {weeklyActivity.map((day) => (

              <div
                key={day.date}
                className={`activity-day ${day.active ? "active" : ""
                  }`}
                style={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >

                <div className="activity-day-label">
                  {day.day}
                </div>

                <div className="activity-day-circle">
                  {day.active ? "✓" : ""}
                </div>

              </div>

            ))}

          </div>

          <div className="activity-summary">

            <span>
              {activeDays} active{" "}
              {activeDays === 1 ? "day" : "days"}
            </span>

            <span>
              Last 7 days
            </span>

          </div>

        </div>

      </section>


      {/* ADAPTIVE LEARNING */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>Adaptive Learning 🧠</h2>

            <p>
              LearnFlow AI identifies concepts that need
              more practice and recommends what to review.
            </p>

          </div>

        </div>


        <div className="adaptive-recommendation-list">

          {adaptiveRecommendations.length > 0 ? (

            adaptiveRecommendations.map(
              (recommendation, index) => (

                <div
                  className="resource-card"
                  key={`${recommendation.concept}-${index}`}
                >

                  <div className="resource-info">

                    <h3>
                      🔴 {recommendation.concept}
                    </h3>

                    <p>
                      Knowledge Score:{" "}
                      <strong>
                        {recommendation.score}%
                      </strong>
                    </p>

                    <p>
                      Attempts: {recommendation.attempts}
                    </p>

                    <p>
                      {recommendation.recommendation}
                    </p>

                  </div>

                  <span className="resource-type">
                    {recommendation.action}
                  </span>

                </div>

              )
            )

          ) : (

            <div className="empty-card">

              <h3>
                You're doing great! 🎉
              </h3>

              <p>
                No weak topics have been detected.
                Keep learning and taking quizzes.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* TODAY'S LEARNING */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>Today's Learning</h2>

            <p>
              {todayTasks.length > 0 ? "Tasks scheduled for today." : "Your next pending learning tasks."}
            </p>

          </div>

        </div>


        <div className="task-list">

          {visibleTasks.length > 0 ? (

            visibleTasks.map((task) => (

              <TaskCard
                key={task.id}
                task={task}
                onCompleted={handleTaskCompleted}
              />

            ))

          ) : (

            <div className="empty-card">

              <h3>
                No pending tasks 🎉
              </h3>

              <p>
                You're all caught up. Enjoy your day
                or explore your courses.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ACTIVE COURSES */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>Active Courses</h2>

            <p>
              Your current learning paths.
            </p>

          </div>

        </div>


        <div className="course-grid">

          {courses.length > 0 ? (

            courses.map((course) => (

              <CourseCard
                key={course.id}
                course={course}
              />

            ))

          ) : (

            <div className="empty-card">

              <h3>
                No courses yet
              </h3>

              <p>
                Save a learning resource to start
                building your first course.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* RECENT RESOURCES */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>Recent Resources</h2>

            <p>
              Recently saved learning material.
            </p>

          </div>

        </div>


        <div className="resource-list">

          {resources.length > 0 ? (

            resources
              .slice(0, 5)
              .map((resource) => (

                <div
                  className="resource-card"
                  key={resource.id}
                >

                  <div className="resource-info">

                    <h3>
                      {resource.title}
                    </h3>

                    <p>
                      {resource.topic ||
                        resource.domain ||
                        "Learning resource"}
                    </p>

                  </div>

                  <span className="resource-type">
                    {resource.type || "RESOURCE"}
                  </span>

                </div>

              ))

          ) : (

            <div className="empty-card">

              <h3>
                No resources yet
              </h3>

              <p>
                Your saved learning resources
                will appear here.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}
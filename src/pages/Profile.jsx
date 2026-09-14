import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../services/api";

export default function Profile({ onLogout }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [daily, setDaily] = useState(45);

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalResources: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("learnflow_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await api.get("/dashboard", token);

        setUser(data.user);
        setStats(data.stats || {});
      } catch (error) {
        console.error("Profile loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-intro">
          <span className="section-kicker">YOUR SPACE</span>
          <h1>Loading profile...</h1>
          <p>Getting your LearnFlow account information.</p>
        </div>
      </div>
    );
  }

  const name = user?.name || "Learner";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="page">

      <div className="page-intro">
        <span className="section-kicker">YOUR SPACE</span>
        <h1>Profile & Settings</h1>
        <p>Control how LearnFlow adapts to your routine.</p>
      </div>

      <div className="profile-layout">

        {/* PROFILE INFORMATION */}
        <section className="panel profile-card">

          <div className="big-avatar">
            {initials}
          </div>

          <h2>{name}</h2>

          <p>
            {user?.email || "LearnFlow AI learner"}
          </p>

          <div className="profile-stat-row">
            <span>Courses</span>
            <strong>{stats.totalCourses || 0}</strong>
          </div>

          <div className="profile-stat-row">
            <span>Resources</span>
            <strong>{stats.totalResources || 0}</strong>
          </div>

          <div className="profile-stat-row">
            <span>Learning time</span>
            <strong>
              {stats.learningTimeMinutes || 0} min
            </strong>
          </div>

          {/* LOGOUT */}
          <button
            className="secondary-button"
            onClick={handleLogout}
            style={{
              width: "100%",
              marginTop: "24px",
            }}
          >
            Log out
          </button>

        </section>

        {/* SETTINGS */}
        <section className="panel settings-panel">

          <span className="section-kicker">
            PREFERENCES
          </span>

          <h2>Learning controls</h2>

          <label className="setting-row">
            <span>
              <strong>Daily learning time</strong>
              <small>
                Target time for adaptive scheduling
              </small>
            </span>

            <select
              value={daily}
              onChange={(e) =>
                setDaily(Number(e.target.value))
              }
            >
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
          </label>

          <label className="setting-row">
            <span>
              <strong>Learning reminders</strong>
              <small>
                Get reminded when a task is due
              </small>
            </span>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) =>
                setNotifications(e.target.checked)
              }
            />
          </label>

          <label className="setting-row">
            <span>
              <strong>Adaptive scheduling</strong>
              <small>
                Reschedule missed tasks automatically
              </small>
            </span>

            <input
              type="checkbox"
              defaultChecked
            />
          </label>

          <label className="setting-row">
            <span>
              <strong>Spaced repetition</strong>
              <small>
                Review concepts based on performance
              </small>
            </span>

            <input
              type="checkbox"
              defaultChecked
            />
          </label>

        </section>

      </div>
    </div>
  );
}
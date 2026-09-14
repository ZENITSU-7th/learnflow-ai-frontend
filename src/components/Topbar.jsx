import { useLocation, useNavigate } from "react-router-dom";

const titles = {
  "/": "Dashboard",
  "/courses": "Courses",
  "/library": "Library",
  "/ask": "Ask AI",
  "/profile": "Profile",
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedUser = (() => {
    try { return JSON.parse(localStorage.getItem("learnflow_user") || "null"); }
    catch { return null; }
  })();

  return (
    <header className="topbar">
      <div>
        <span className="topbar-kicker">LEARNFLOW AI</span>
        <h2>{titles[location.pathname] || "LearnFlow AI"}</h2>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" title="Notifications" onClick={() => alert("No new notifications.")}>♢</button>
        <button className="profile-chip" onClick={() => navigate("/profile")}>
          <span className="avatar">
            {(savedUser?.name || "L").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
          </span>
          <span className="profile-name">{savedUser?.name || "Learner"}</span>
        </button>
      </div>
    </header>
  );
}

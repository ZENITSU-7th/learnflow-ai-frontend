import { NavLink } from "react-router-dom";

const items = [
  ["◈", "Dashboard", "/"],
  ["▦", "Courses", "/courses"],
  ["◇", "Library", "/library"],
  ["✦", "Ask AI", "/ask"],
  ["◎", "Profile", "/profile"],
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">✦</div>
        <div>
          <strong>LearnFlow</strong>
          <span>AI</span>
        </div>
      </div>

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="side-nav">
        {items.map(([icon, label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="mini-course">
          <span className="mini-dot" />
          <div>
            <strong>Today</strong>
            <small>3 learning tasks</small>
          </div>
        </div>
        <div className="sidebar-tip">Learn smarter, not harder.</div>
      </div>
    </aside>
  );
}

import { NavLink } from "react-router-dom";

const items = [
  ["⌂", "Home", "/"],
  ["▦", "Courses", "/courses"],
  ["◇", "Library", "/library"],
  ["✦", "Ask", "/ask"],
  ["◎", "Profile", "/profile"],
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {items.map(([icon, label, to]) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <span>{icon}</span>
          <small>{label}</small>
        </NavLink>
      ))}
    </nav>
  );
}

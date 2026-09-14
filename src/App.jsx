import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MobileNav from "./components/MobileNav";
import AmbientBackground from "./components/AmbientBackground";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Library from "./pages/Library";
import AskAI from "./pages/AskAI";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import CourseDetails from "./pages/CourseDetails";
import Quiz from "./pages/Quiz";

function AnimatedRoutes({ user, onLogin, onLogout }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // ==============================
  // NOT LOGGED IN
  // ==============================
  if (!user) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={onLogin} />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    );
  }

  // ==============================
  // LOGGED IN
  // ==============================
  return (
    <div className="app">
      <AmbientBackground />

      <Sidebar />

      <main className="main">
        <Topbar />

        <div
          key={location.pathname}
          className="page-transition"
        >
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/courses"
              element={<Courses />}
            />

            <Route
              path="/library"
              element={<Library />}
            />

            <Route
              path="/courses/:id"
              element={<CourseDetails />}
            />

            <Route
              path="/ask"
              element={<AskAI />}
            />

            <Route
              path="/quiz/:id"
              element={<Quiz />}
            />

            <Route
              path="/profile"
              element={<Profile onLogout={onLogout} />}
            />


            <Route
              path="/login"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

export default function App() {
  // ==============================
  // AUTHENTICATION STATE
  // ==============================
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("learnflow_user");
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("learnflow_user");
      localStorage.removeItem("learnflow_token");
      return null;
    }
  });

  useEffect(() => {
    const syncSession = async () => {
      const token = localStorage.getItem("learnflow_token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const data = await import("./services/api").then((m) => m.api.getMe());
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("learnflow_user", JSON.stringify(data.user));
        }
      } catch {
        localStorage.removeItem("learnflow_token");
        localStorage.removeItem("learnflow_user");
        setUser(null);
      }
    };
    syncSession();

    const handleForcedLogout = () => setUser(null);
    window.addEventListener("learnflow:logout", handleForcedLogout);
    return () => window.removeEventListener("learnflow:logout", handleForcedLogout);
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("learnflow_token");
    localStorage.removeItem("learnflow_user");

    setUser(null);
  };

  return (
    <BrowserRouter>
      <AnimatedRoutes
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}
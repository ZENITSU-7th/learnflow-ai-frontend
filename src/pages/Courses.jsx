import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { api } from "../services/api";

export default function Courses() {
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Programming",
    "Computer Science",
    "Academic",
    "Language",
    "Professional",
    "Creative",
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("learnflow_token");

        if (!token) {
          setError("Please sign in to view your courses.");
          return;
        }

        const data = await api.get("/courses", token);

        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError(err.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses =
    filter === "All"
      ? courses
      : courses.filter((course) => {
        const category =
          course.category ||
          course.type ||
          "";

        return (
          category.toLowerCase() === filter.toLowerCase()
        );
      });

  return (
    <div className="page">
      <div className="page-intro">
        <span className="section-kicker">LEARNING SPACE</span>

        <h1>My Courses</h1>

        <p>
          Your courses adapt as your knowledge and learning
          behaviour change.
        </p>
      </div>

      <div className="filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter ${filter === category ? "active" : ""
              }`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="empty-state">
          Loading your courses...
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          {error}
        </div>
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>
            Generate a course from your analyzed learning
            resources to see it here.
          </p>
        </div>
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div className="courses-grid large">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
}
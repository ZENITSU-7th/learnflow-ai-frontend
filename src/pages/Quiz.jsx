import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get(`/quizzes/${id}`);
        setQuiz(data.quiz);
      } catch (e) {
        setError(e.message || "Unable to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const submit = async () => {
    if (!quiz || submitting) return;
    const payload = quiz.questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id],
    }));
    setSubmitting(true);
    try {
      const data = await api.post(`/quizzes/${id}/submit`, { answers: payload });
      setResult(data.result);
    } catch (e) {
      setError(e.message || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><div className="empty-state">Loading quiz...</div></div>;
  if (error) return <div className="page"><div className="empty-state"><h3>Quiz unavailable</h3><p>{error}</p><button className="primary-button" onClick={() => navigate(-1)}>Go back</button></div></div>;
  if (!quiz) return null;

  return (
    <div className="page">
      <div className="page-intro">
        <button className="filter" onClick={() => navigate(-1)}>← Back</button>
        <span className="section-kicker" style={{ display: "block", marginTop: 24 }}>KNOWLEDGE CHECK</span>
        <h1>{quiz.title}</h1>
        <p>{quiz.difficulty} · {quiz.questions.length} questions</p>
      </div>

      {result ? (
        <section className="panel" style={{ marginTop: 24 }}>
          <span className="section-kicker">RESULT</span>
          <h2 style={{ fontSize: 48, margin: "8px 0" }}>{result.percentage}%</h2>
          <p>You scored {result.score} out of {result.total}.</p>
          <div className="resource-list" style={{ marginTop: 24 }}>
            {result.knowledgeScores?.map((item) => (
              <div className="resource-card" key={item.concept}>
                <div className="resource-info">
                  <h3>{item.concept}</h3>
                  <p>Knowledge score: {Math.round(item.score)}% · {item.attempts} attempts</p>
                </div>
              </div>
            ))}
          </div>
          <button className="primary-button" style={{ marginTop: 20 }} onClick={() => navigate("/")}>Return to dashboard</button>
        </section>
      ) : (
        <>
          <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
            {quiz.questions.map((q, index) => (
              <section className="panel" key={q.id}>
                <span className="section-kicker">QUESTION {index + 1}</span>
                <h3 style={{ marginTop: 10 }}>{q.question}</h3>
                <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                  {(Array.isArray(q.options) ? q.options : []).map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: answers[q.id] === optionIndex
                          ? "1px solid rgba(120,180,255,.7)"
                          : "1px solid rgba(255,255,255,.08)",
                        background: answers[q.id] === optionIndex
                          ? "rgba(100,140,255,.12)"
                          : "rgba(255,255,255,.03)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[q.id] === optionIndex}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: optionIndex }))}
                        style={{ marginRight: 10 }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <button
            className="primary-button"
            style={{ marginTop: 24 }}
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Checking answers..." : "Submit quiz"}
          </button>
        </>
      )}
    </div>
  );
}

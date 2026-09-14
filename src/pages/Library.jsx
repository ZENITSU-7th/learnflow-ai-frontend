import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Library() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.get("/resources");
      setResources(data.resources || []);
    } catch (e) {
      setError(e.message || "Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResources(); }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get("sharedUrl");

    if (!sharedUrl) return;

    const processSharedUrl = async () => {
      try {
        setSaving(true);
        setError("");

        const saved = await api.post("/resources/ingest", {
          url: sharedUrl,
          title: sharedUrl,
        });

        const analyzed = await api.post(
          `/ai/analyze/${saved.resource.id}`,
          {}
        );

        setResources((current) => [
          analyzed.resource,
          ...current.filter(
            (r) => r.id !== analyzed.resource.id
          ),
        ]);

        window.history.replaceState(
          {},
          document.title,
          "/library"
        );
      } catch (e) {
        if (
          e.message &&
          e.message.toLowerCase().includes("already saved")
        ) {
          await loadResources();

          window.history.replaceState(
            {},
            document.title,
            "/library"
          );
        } else {
          setError(
            e.message ||
            "Failed to analyze shared resource."
          );
        }
      } finally {
        setSaving(false);
      }
    };

    processSharedUrl();
  }, []);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return resources.filter((r) =>
      `${r.title || ""} ${r.topic || ""} ${r.type || ""} ${r.domain || ""}`.toLowerCase().includes(q)
    );
  }, [resources, query]);

  const handleSave = async () => {
    if (!url.trim() && !content.trim()) {
      setError("Add a URL or paste some learning text.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const saved = await api.post("/resources/ingest", {
        url: url.trim() || undefined,
        content: content.trim() || undefined,
        title: url.trim() ? url.trim() : content.trim().slice(0, 80),
      });
      const analyzed = await api.post(`/ai/analyze/${saved.resource.id}`, {});
      setResources((current) => [analyzed.resource, ...current.filter((r) => r.id !== analyzed.resource.id)]);
      setUrl("");
      setContent("");
      setShowAdd(false);
    } catch (e) {
      setError(e.message || "Failed to save and analyze resource.");
    } finally {
      setSaving(false);
    }
  };

  const generateCourse = async () => {
    if (resources.filter((r) => r.isEducational && r.aiAnalysis).length === 0) {
      setError("Save and analyze at least one educational resource first.");
      return;
    }
    try {
      setGenerating(true);
      setError("");
      const data = await api.post("/ai/generate-course", {});
      if (data.course?.id) navigate(`/courses/${data.course.id}`);
      else navigate("/courses");
    } catch (e) {
      setError(e.message || "Course generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this saved resource?")) return;
    try {
      await api.delete(`/resources/${id}`);
      setResources((current) => current.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Failed to delete resource.");
    }
  };

  return (
    <div className="page">
      <div className="page-intro library-intro">
        <div>
          <span className="section-kicker">YOUR KNOWLEDGE BASE</span>
          <h1>Library</h1>
          <p>Save learning material, let Gemini analyze it, then turn it into a personalized course.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="secondary-button" onClick={generateCourse} disabled={generating}>
            {generating ? "Building course..." : "✦ Build course"}
          </button>
          <button className="primary-button" onClick={() => { setError(""); setShowAdd(true); }}>+ Save resource</button>
        </div>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search saved resources..." />
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

      {loading ? <div className="empty-state">Loading your resources...</div> :
        filtered.length === 0 ? <div className="empty-state"><h3>No resources found</h3><p>Save a URL or paste learning text to begin.</p></div> :
          <div className="resource-grid">
            {filtered.map((resource) => (
              <article className="resource-card" key={resource.id}>
                <div className="resource-top">
                  <span className="resource-type">{resource.type || "web"}</span>
                  <span className="resource-status">{resource.isEducational ? "● Educational" : "● Leisure"}</span>
                </div>
                <h3>{resource.title || "Untitled Resource"}</h3>
                <p>{resource.domain || "Unknown domain"}{resource.topic ? ` · ${resource.topic}` : ""}</p>
                {resource.summary && <p style={{ marginTop: 8 }}>{resource.summary}</p>}
                <div className="resource-bottom">
                  <span>{resource.difficulty || "Not analyzed"}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    {resource.url && <button onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}>Open →</button>}
                    <button onClick={() => deleteResource(resource.id)} aria-label="Delete resource">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
      }

      {showAdd && (
        <div className="modal-backdrop" onClick={() => !saving && setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !saving && setShowAdd(false)}>×</button>
            <span className="section-kicker">ADD TO KNOWLEDGE BASE</span>
            <h2>Save a resource</h2>
            <p>Paste a webpage URL, or use learning text directly.</p>
            <input className="modal-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." disabled={saving} />
            <textarea className="modal-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Optional: paste article/notes here..." rows={6} disabled={saving} />
            <button className="primary-button full" onClick={handleSave} disabled={saving}>
              {saving ? "Saving & analyzing..." : "Analyze & save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

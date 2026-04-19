import { useRef, useState } from "react";
import { screenCV } from "./api.js";

function scoreColor(score) {
  if (score >= 70) return "green";
  if (score >= 40) return "amber";
  return "red";
}

export default function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({ file: "", jd: "" });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrors((e) => ({ ...e, file: "Please upload a PDF file." }));
      return;
    }
    setCvFile(file);
    setErrors((e) => ({ ...e, file: "" }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { file: "", jd: "" };
    if (!cvFile) newErrors.file = "Please upload a CV (PDF).";
    if (!jobDescription.trim()) newErrors.jd = "Please paste a job description.";
    setErrors(newErrors);
    if (newErrors.file || newErrors.jd) return;

    setLoading(true);
    setError("");
    try {
      const data = await screenCV({ cvFile, jobDescription });
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCvFile(null);
    setJobDescription("");
    setResult(null);
    setError("");
    setErrors({ file: "", jd: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CV</div>
          <div>
            <div className="brand-title">CV Screener</div>
            <div className="brand-sub">AI-powered candidate matching</div>
          </div>
        </div>
      </header>

      <main className="main">
        {!result ? (
          <section className="card upload-card">
            <h1 className="card-title">Screen a candidate</h1>
            <p className="card-subtitle">
              Upload a CV and paste the job description to get an instant match analysis.
            </p>

            {error && <div className="banner banner-error">{error}</div>}

            <form onSubmit={onSubmit} noValidate>
              <label className="label">CV (PDF)</label>
              <div
                className={`dropzone ${dragOver ? "is-drag" : ""} ${errors.file ? "has-error" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  hidden
                />
                {cvFile ? (
                  <div className="dz-file">
                    <span className="dz-icon">📄</span>
                    <span className="dz-name">{cvFile.name}</span>
                    <button
                      type="button"
                      className="dz-clear"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="dz-empty">
                    <div className="dz-icon-lg">⬆</div>
                    <div className="dz-text">
                      <strong>Drag & drop a PDF</strong> or click to browse
                    </div>
                  </div>
                )}
              </div>
              {errors.file && <div className="field-error">{errors.file}</div>}

              <label className="label" htmlFor="jd">
                Job description
              </label>
              <textarea
                id="jd"
                className={`textarea ${errors.jd ? "has-error" : ""}`}
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={9}
              />
              {errors.jd && <div className="field-error">{errors.jd}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" /> Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </button>
            </form>
          </section>
        ) : (
          <section className="card result-card">
            <ScoreRing score={result.match_score} />

            <div className="grid">
              <div className="panel">
                <h3 className="panel-title">Matched Skills</h3>
                <div className="chips">
                  {(result.matched_skills || []).map((s) => (
                    <span key={s} className="chip chip-green">
                      {s}
                    </span>
                  ))}
                  {(!result.matched_skills || result.matched_skills.length === 0) && (
                    <span className="muted">None found</span>
                  )}
                </div>
              </div>

              <div className="panel">
                <h3 className="panel-title">Missing Skills</h3>
                <div className="chips">
                  {(result.missing_skills || []).map((s) => (
                    <span key={s} className="chip chip-red">
                      {s}
                    </span>
                  ))}
                  {(!result.missing_skills || result.missing_skills.length === 0) && (
                    <span className="muted">None</span>
                  )}
                </div>
              </div>

              <div className="panel panel-wide">
                <h3 className="panel-title">Recommendations</h3>
                <ol className="recs">
                  {(result.recommendations || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </div>
            </div>

            {result.summary && (
              <p className="summary">{result.summary}</p>
            )}

            <button className="btn btn-secondary" onClick={reset}>
              Screen Another CV
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function ScoreRing({ score }) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));
  const variant = scoreColor(safe);
  const colors = {
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
  };
  const color = colors[variant];
  const bg = `conic-gradient(${color} ${safe * 3.6}deg, #e5e7eb 0deg)`;
  return (
    <div className="ring-wrap">
      <div className="ring" style={{ background: bg }}>
        <div className="ring-inner">
          <div className={`ring-score ring-${variant}`}>{safe}</div>
          <div className="ring-label">/ 100</div>
        </div>
      </div>
      <div className="ring-caption">Match Score</div>
    </div>
  );
}

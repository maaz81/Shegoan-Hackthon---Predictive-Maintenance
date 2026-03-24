import { useState } from "react";
import "../Test.css";

const API_URL = "http://localhost:8000";

const DEFAULT_FORM = {
    log: "",
    temp: "",
    vibration: "",
    rpm: "",
};

const RISK_CONFIG = {
    High: { cls: "risk-high", label: "HIGH RISK", icon: "▲" },
    Medium: { cls: "risk-medium", label: "MEDIUM RISK", icon: "◆" },
    Low: { cls: "risk-low", label: "LOW RISK", icon: "●" },
};

function StatusBadge({ level }) {
    const cfg = RISK_CONFIG[level] || RISK_CONFIG["Low"];
    return (
        <span className={`badge ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function ConfidenceBar({ value }) {
    const pct = Math.round(value * 100);
    return (
        <div className="confidence-wrap">
            <div className="confidence-label">
                <span>Model Confidence</span>
                <span className="confidence-pct">{pct}%</span>
            </div>
            <div className="confidence-track">
                <div className="confidence-fill" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function MetricInput({ label, id, value, onChange, placeholder, type = "number" }) {
    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                />
            ) : (
                <input
                    id={id}
                    type="number"
                    step="any"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
}

function ResultPanel({ data }) {
    return (
        <div className="result-panel">
            <div className="result-header">
                <div>
                    <p className="result-header-sub">MACHINE STATUS</p>
                    <StatusBadge level={data.machine_status} />
                </div>
                <div className="result-action-box">
                    <p className="result-header-sub">RECOMMENDED ACTION</p>
                    <p className="result-action">{data.recommended_action}</p>
                </div>
            </div>

            <div className="result-grid">
                <div className="metric-card">
                    <span className="metric-label">Rule-Based</span>
                    <StatusBadge level={data.rule_based} />
                </div>
                <div className="metric-card">
                    <span className="metric-label">ML Prediction</span>
                    <StatusBadge level={data.ml_prediction} />
                </div>
                <div className="metric-card metric-wide">
                    <span className="metric-label">Detected Issue</span>
                    <span className="metric-value">{data.issue}</span>
                </div>
            </div>

            <ConfidenceBar value={data.confidence} />

            <div className="explanation-box">
                <p className="explanation-label">
                    <span className="dot" /> AI Explanation
                </p>
                <p className="explanation-text">{data.explanation}</p>
            </div>
        </div>
    );
}

export default function Test() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async () => {
        const { log, temp, vibration, rpm } = form;
        if (!log || temp === "" || vibration === "" || rpm === "") {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`${API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    log,
                    temp: parseFloat(temp),
                    vibration: parseFloat(vibration),
                    rpm: parseFloat(rpm),
                }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(DEFAULT_FORM);
        setResult(null);
        setError(null);
    };

    return (
        <div className="app">
            <header className="header">
                <div className="header-inner">
                    <div className="logo">
                        <span className="logo-icon">⬡</span>
                        <span className="logo-text">MachineGuard</span>
                    </div>
                    <p className="header-sub">Predictive Failure Detection System</p>
                </div>
                <div className="header-status">
                    <span className="live-dot" />
                    LIVE MONITOR
                </div>
            </header>

            <main className="main">
                <section className="form-section">
                    <div className="section-title">
                        <span className="section-num">01</span> Sensor Input
                    </div>

                    <MetricInput
                        label="Machine Log"
                        id="log"
                        value={form.log}
                        onChange={handleChange("log")}
                        placeholder="e.g. Motor X shows abnormal vibration at high RPM..."
                        type="textarea"
                    />

                    <div className="row-3">
                        <MetricInput
                            label="Temperature (°C)"
                            id="temp"
                            value={form.temp}
                            onChange={handleChange("temp")}
                            placeholder="e.g. 320"
                        />
                        <MetricInput
                            label="Vibration (g)"
                            id="vibration"
                            value={form.vibration}
                            onChange={handleChange("vibration")}
                            placeholder="e.g. 0.9"
                        />
                        <MetricInput
                            label="RPM"
                            id="rpm"
                            value={form.rpm}
                            onChange={handleChange("rpm")}
                            placeholder="e.g. 3500"
                        />
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <div className="btn-row">
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" /> Analyzing...
                                </>
                            ) : (
                                "Run Analysis"
                            )}
                        </button>
                        <button className="btn-ghost" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </section>

                <section className="result-section">
                    <div className="section-title">
                        <span className="section-num">02</span> Analysis Result
                    </div>

                    {!result && !loading && (
                        <div className="empty-state">
                            <div className="empty-icon">◎</div>
                            <p>Submit sensor data to see the analysis</p>
                        </div>
                    )}

                    {loading && (
                        <div className="empty-state">
                            <div className="pulse-ring" />
                            <p>Running ML + Rule Engine...</p>
                        </div>
                    )}

                    {result && <ResultPanel data={result} />}
                </section>
            </main>

            <footer className="footer">
                MachineGuard v1.0 · Powered by FastAPI + RandomForest + OpenRouter
            </footer>
        </div>
    );
}
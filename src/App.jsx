import { useState, useEffect } from "react";

const QUESTIONS = [
  { id: "turnover", question: "What is your approximate annual turnover?", subtitle: "A rough ballpark is absolutely fine", type: "select", options: ["Under £250k", "£250k – £500k", "£500k – £1m", "£1m – £3m", "£3m – £10m", "Over £10m"] },
  { id: "employees", question: "How many people work in the business?", subtitle: "Include yourself", type: "select", options: ["Just me", "2–5", "6–15", "16–50", "50+"] },
  { id: "software", question: "What software do you use for bookkeeping or accounts?", subtitle: "Pick the closest match", type: "select", options: ["Xero", "QuickBooks", "Sage", "Excel / spreadsheets only", "My accountant handles it", "Nothing formal"] },
  { id: "close_time", question: "How long after month end do you know how profitable that month was?", subtitle: "Be honest — this is one of the most telling numbers", type: "select", options: ["Within a week", "2–3 weeks", "A month or more", "I only find out at year end", "I'm not really sure"] },
  { id: "cash_forecast", question: "Do you have a cash flow forecast?", subtitle: "Even a rough one counts", type: "select", options: ["Yes, I update it regularly", "I have one but rarely use it", "No, but I'd like one", "No and I've never needed one", "What's a cash flow forecast?"] },
  { id: "job_margin", question: "Do you know which jobs or services make you the most money?", subtitle: "Margin visibility by job type or customer", type: "select", options: ["Yes, clearly", "I have a rough idea", "Not really", "No idea at all"] },
  { id: "busy_skint", question: "Have you ever had a period where you were busy but still felt short on cash?", subtitle: "This is more common than people admit", type: "select", options: ["Yes, regularly", "Yes, once or twice", "Not really", "Never"] },
  { id: "reporting", question: "What financial reporting do you currently receive?", subtitle: "Select the closest description", type: "select", options: ["Regular monthly management accounts", "Occasional reports from my bookkeeper", "Year-end accounts only", "I look at my bank balance", "Nothing formal"] },
  { id: "biggest_headache", question: "What is your biggest financial headache right now?", subtitle: "In your own words — no wrong answers", type: "text", placeholder: "e.g. I never know if I'm actually making money until my accountant tells me..." },
  { id: "fix_90_days", question: "If you could fix one financial problem in the next 90 days, what would it be?", subtitle: "This helps us prioritise what matters most to you", type: "text", placeholder: "e.g. I want to know my numbers without having to chase my bookkeeper..." }
];

const s = {
  mono: "'DM Mono', monospace",
  serif: "'Playfair Display', serif",
  sans: "'DM Sans', sans-serif",
  green: "#10b981",
  darkGreen: "#059669",
  bg: "#030712",
  card: "rgba(255,255,255,0.02)",
  border: "rgba(255,255,255,0.07)",
  text: "#f9fafb",
  muted: "#9ca3af",
  dim: "#6b7280",
};

const ProgressBar = ({ current, total }) => (
  <div style={{ marginBottom: "2rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
      <span style={{ fontFamily: s.mono, fontSize: "0.75rem", color: s.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>Question {current} of {total}</span>
      <span style={{ fontFamily: s.mono, fontSize: "0.75rem", color: s.green }}>{Math.round((current / total) * 100)}%</span>
    </div>
    <div style={{ height: "3px", background: "#1f2937", borderRadius: "2px" }}>
      <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: `linear-gradient(90deg, ${s.green}, #34d399)`, borderRadius: "2px", transition: "width 0.5s ease" }} />
    </div>
  </div>
);

const QuestionCard = ({ q, value, onChange, onNext, onBack, isFirst, isLast, questionNumber, total }) => {
  const canProceed = value && value.trim() !== "";
  return (
    <div style={{ animation: "slideIn 0.4s ease" }}>
      <ProgressBar current={questionNumber} total={total} />
      <div style={{ marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: s.mono, fontSize: "0.7rem", color: s.green, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {String(questionNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <h2 style={{ fontFamily: s.serif, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: s.text, fontWeight: 700, lineHeight: 1.3, marginBottom: "0.75rem" }}>{q.question}</h2>
      <p style={{ fontFamily: s.sans, color: s.muted, fontSize: "0.9rem", marginBottom: "2rem" }}>{q.subtitle}</p>
      {q.type === "select" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {q.options.map(opt => (
            <button key={opt} onClick={() => onChange(opt)} style={{ padding: "1rem 1.25rem", background: value === opt ? "rgba(16,185,129,0.15)" : s.card, border: `1px solid ${value === opt ? s.green : "rgba(255,255,255,0.08)"}`, borderRadius: "8px", color: value === opt ? s.green : "#d1d5db", fontFamily: s.sans, fontSize: "0.95rem", textAlign: "left", cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${value === opt ? s.green : "#374151"}`, background: value === opt ? s.green : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {value === opt && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
              </span>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={q.placeholder} rows={4} style={{ width: "100%", padding: "1rem", background: s.card, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: s.text, fontFamily: s.sans, fontSize: "0.95rem", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
      )}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        {!isFirst && <button onClick={onBack} style={{ padding: "0.875rem 1.5rem", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: s.muted, fontFamily: s.sans, fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>}
        <button onClick={onNext} disabled={!canProceed} style={{ flex: 1, padding: "0.875rem 2rem", background: canProceed ? `linear-gradient(135deg, ${s.green}, ${s.darkGreen})` : "rgba(255,255,255,0.05)", border: "none", borderRadius: "8px", color: canProceed ? "#fff" : "#4b5563", fontFamily: s.sans, fontSize: "0.95rem", fontWeight: 600, cursor: canProceed ? "pointer" : "not-allowed", transition: "all 0.2s ease" }}>
          {isLast ? "Generate My Finance MOT →" : "Next →"}
        </button>
      </div>
    </div>
  );
};

const LoadingReport = () => {
  const steps = ["Analysing your business profile...", "Identifying cash flow risks...", "Reviewing your reporting gaps...", "Calculating your MOT score...", "Building your action plan..."];
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 1800); return () => clearInterval(t); }, []);
  return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <div style={{ width: "64px", height: "64px", border: `3px solid rgba(16,185,129,0.2)`, borderTop: `3px solid ${s.green}`, borderRadius: "50%", margin: "0 auto 2rem", animation: "spin 1s linear infinite" }} />
      <h3 style={{ fontFamily: s.serif, color: s.text, fontSize: "1.5rem", marginBottom: "1rem" }}>Running your Finance MOT</h3>
      <p style={{ fontFamily: s.mono, color: s.green, fontSize: "0.85rem", letterSpacing: "0.05em" }}>{steps[step]}</p>
    </div>
  );
};

const SoftPrompt = ({ onSubmit, onDismiss, sending }) => {
  const [mode, setMode] = useState(null); // 'call' or 'report'
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const canSubmit = company.trim() && name.trim() && email.trim() && agreed && (mode === 'report' || (mode === 'call' && phone.trim()));

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: s.text, fontFamily: s.sans, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, padding: "1rem", transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", background: "#0f172a", border: `1px solid ${s.green}`, borderRadius: "16px 16px 0 0", padding: "1.5rem", boxShadow: "0 -20px 60px rgba(0,0,0,0.5)" }}>
        {!mode ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontFamily: s.serif, color: s.text, fontSize: "1.15rem", fontWeight: 700, margin: "0 0 4px" }}>Found this useful?</p>
                <p style={{ fontFamily: s.sans, color: s.muted, fontSize: "0.85rem", margin: 0 }}>Get a copy sent to you — and we'll check in to see how you're getting on.</p>
              </div>
              <button onClick={onDismiss} style={{ background: "none", border: "none", color: s.dim, cursor: "pointer", fontSize: "1.2rem", padding: "0 0 0 1rem", flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button onClick={() => setMode('call')} style={{ padding: "1rem", background: `rgba(16,185,129,0.1)`, border: `1px solid ${s.green}`, borderRadius: "10px", color: s.green, fontFamily: s.sans, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                📞 I'd like a free call to discuss my results
                <span style={{ display: "block", color: s.muted, fontWeight: 400, fontSize: "0.8rem", marginTop: "3px" }}>We'll walk through your report and build a plan together</span>
              </button>
              <button onClick={() => setMode('report')} style={{ padding: "1rem", background: s.card, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#d1d5db", fontFamily: s.sans, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                📧 Just send me the report
                <span style={{ display: "block", color: s.muted, fontWeight: 400, fontSize: "0.8rem", marginTop: "3px" }}>We'll email you a copy to refer back to</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: s.serif, color: s.text, fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                {mode === 'call' ? '📞 Book a free call' : '📧 Send me the report'}
              </p>
              <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: s.dim, cursor: "pointer", fontSize: "0.85rem", fontFamily: s.sans }}>← Back</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name" style={inputStyle} />
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={inputStyle} />
              {mode === 'call' && <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel" style={inputStyle} />}
              <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: "3px", accentColor: s.green, flexShrink: 0 }} />
                <span style={{ fontFamily: s.sans, color: s.muted, fontSize: "0.8rem", lineHeight: 1.5 }}>
                  I agree to Coseek storing my details and sending me relevant information. We'll never share your data with third parties.
                </span>
              </label>
              <button onClick={() => onSubmit({ company, name, email, phone, wantsCall: mode === 'call', agreed })} disabled={!canSubmit || sending} style={{ padding: "0.875rem", background: canSubmit && !sending ? `linear-gradient(135deg, ${s.green}, ${s.darkGreen})` : "rgba(255,255,255,0.05)", border: "none", borderRadius: "8px", color: canSubmit && !sending ? "#fff" : "#4b5563", fontFamily: s.sans, fontWeight: 600, fontSize: "0.95rem", cursor: canSubmit && !sending ? "pointer" : "not-allowed" }}>
                {sending ? "Sending..." : mode === 'call' ? "Submit & Book My Call →" : "Send My Report →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ReportView = ({ report, answers, onContactSubmit, contactSubmitted, sending }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const sections = report.split("\n\n").filter(s => s.trim());

  useEffect(() => {
    const t = setTimeout(() => setShowPrompt(true), 30000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ animation: "slideIn 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${s.border}` }}>
        <div style={{ width: "48px", height: "48px", background: `linear-gradient(135deg, ${s.green}, ${s.darkGreen})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>✓</div>
        <div>
          <h2 style={{ fontFamily: s.serif, color: s.text, fontSize: "1.5rem", margin: 0 }}>Your Finance MOT Report</h2>
          <p style={{ fontFamily: s.mono, color: s.dim, fontSize: "0.75rem", margin: "0.25rem 0 0", letterSpacing: "0.1em" }}>POWERED BY COSEEK AI</p>
        </div>
      </div>

      <div style={{ fontFamily: s.sans, color: "#d1d5db", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {sections.map((section, i) => {
          const cleaned = section.replace(/\*\*/g, "").replace(/^#+\s/, "");
          if (cleaned.includes(":") && cleaned.split(":")[0].length < 50 && !cleaned.includes("\n")) {
            const [label, ...rest] = cleaned.split(":");
            return <div key={i} style={{ padding: "1rem 1.25rem", background: `rgba(16,185,129,0.05)`, border: `1px solid rgba(16,185,129,0.15)`, borderRadius: "8px", marginBottom: "1rem" }}><span style={{ color: s.green, fontWeight: 600 }}>{label}:</span><span>{rest.join(":")}</span></div>;
          }
          if (cleaned.length < 80 && (cleaned.toUpperCase() === cleaned || section.startsWith("**"))) {
            return <h3 key={i} style={{ fontFamily: s.serif, color: s.text, fontSize: "1.15rem", marginTop: "1.75rem", marginBottom: "0.75rem" }}>{cleaned}</h3>;
          }
          return <p key={i} style={{ marginBottom: "1rem" }}>{cleaned}</p>;
        })}
      </div>

      {contactSubmitted ? (
        <div style={{ marginTop: "2rem", padding: "1.5rem", background: `rgba(16,185,129,0.1)`, border: `1px solid rgba(16,185,129,0.25)`, borderRadius: "12px", textAlign: "center" }}>
          <p style={{ fontFamily: s.serif, color: s.text, fontSize: "1.15rem", margin: "0 0 0.5rem" }}>✓ You're all set</p>
          <p style={{ fontFamily: s.sans, color: s.muted, fontSize: "0.9rem", margin: "0 0 0.75rem" }}>Your details are saved and your report is on its way to your inbox.</p>
          {contactSubmittedWantsCall && (
            <a href="https://calendly.com/coseekai/30min" target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "0.75rem", padding: "0.875rem 1.75rem", background: `linear-gradient(135deg, ${s.green}, ${s.darkGreen})`, borderRadius: "8px", color: "#fff", fontFamily: s.sans, fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
              📅 Book Your Free Call Now →
            </a>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: `linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))`, border: `1px solid rgba(16,185,129,0.25)`, borderRadius: "12px", textAlign: "center" }}>
          <p style={{ fontFamily: s.serif, color: s.text, fontSize: "1.15rem", marginBottom: "0.5rem" }}>Want to act on this?</p>
          <p style={{ fontFamily: s.sans, color: s.muted, fontSize: "0.9rem", marginBottom: "1.25rem" }}>Book a free 30-minute call to walk through your results and build a plan.</p>
          <a href="https://calendly.com/coseekai/30min" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "0.875rem 2rem", background: `linear-gradient(135deg, ${s.green}, ${s.darkGreen})`, borderRadius: "8px", color: "#fff", fontFamily: s.sans, fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>Book a Free Call →</a>
        </div>
      )}

      {showPrompt && !contactSubmitted && (
        <SoftPrompt onSubmit={onContactSubmit} onDismiss={() => setShowPrompt(false)} sending={sending} />
      )}
    </div>
  );
};

export default function CoseekFinanceMOT() {
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmittedWantsCall, setContactSubmittedWantsCall] = useState(false);
  const [sending, setSending] = useState(false);

  const handleStart = () => setStep("questions");
  const handleAnswer = val => setAnswers(prev => ({ ...prev, [QUESTIONS[currentQ].id]: val }));
  const handleBack = () => { if (currentQ > 0) setCurrentQ(q => q - 1); };

  const handleNext = async () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setStep("loading");
      setLoading(true);
      await generateReport(null);
    }
  };

  const generateReport = async (contact) => {
    const summary = QUESTIONS.map(q => `${q.question}: ${answers[q.id] || "Not answered"}`).join("\n");
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: summary, contact })
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        setStep("report");
      } else {
        throw new Error("No report returned");
      }
    } catch (e) {
      setError("Something went wrong generating your report. Please try again.");
      setStep("questions");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (contact) => {
    setSending(true);
    const summary = QUESTIONS.map(q => `${q.question}: ${answers[q.id] || "Not answered"}`).join("\n");
    try {
      await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: summary, report, contact, emailOnly: true })
      });
      setContactSubmitted(true);
      if (contact.wantsCall) setContactSubmittedWantsCall(true);
      if (contact.wantsCall) {
        // Calendly opens via button click - no automatic popup
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #030712; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ minHeight: "100vh", background: s.bg, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 60%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "640px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "32px", height: "32px", background: `linear-gradient(135deg, ${s.green}, ${s.darkGreen})`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>⚡</div>
            <span style={{ fontFamily: s.mono, color: s.text, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}>COSEEK</span>
          </div>
          <span style={{ fontFamily: s.mono, color: s.dim, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Finance MOT</span>
        </div>

        <div style={{ width: "100%", maxWidth: "640px", background: s.card, border: `1px solid ${s.border}`, borderRadius: "16px", padding: "clamp(1.5rem, 5vw, 2.5rem)", backdropFilter: "blur(10px)" }}>
          {step === "intro" && (
            <div style={{ animation: "slideIn 0.5s ease" }}>
              <div style={{ display: "inline-block", padding: "0.35rem 0.75rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: s.mono, color: s.green, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Free · Takes 5 minutes</span>
              </div>
              <h1 style={{ fontFamily: s.serif, fontSize: "clamp(2rem, 5vw, 3rem)", color: s.text, fontWeight: 800, lineHeight: 1.15, marginBottom: "1.25rem" }}>
                Is your business<br /><span style={{ color: s.green }}>financially roadworthy?</span>
              </h1>
              <p style={{ fontFamily: s.sans, color: s.muted, fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                The Coseek Finance MOT checks your business finances the same way a mechanic checks your car — identifying what's working, what needs attention, and what could leave you stranded.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
                {[{ icon: "🔍", label: "10 questions" }, { icon: "⚡", label: "Instant report" }, { icon: "🎯", label: "Clear actions" }].map(item => (
                  <div key={item.label} style={{ padding: "1rem", background: s.card, border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>{item.icon}</div>
                    <div style={{ fontFamily: s.mono, color: s.dim, fontSize: "0.7rem", letterSpacing: "0.08em" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={handleStart} style={{ width: "100%", padding: "1rem 2rem", background: `linear-gradient(135deg, ${s.green}, ${s.darkGreen})`, border: "none", borderRadius: "10px", color: "#fff", fontFamily: s.sans, fontWeight: 600, fontSize: "1rem", cursor: "pointer" }}>
                Start My Finance MOT →
              </button>
              <p style={{ fontFamily: s.sans, color: "#4b5563", fontSize: "0.8rem", textAlign: "center", marginTop: "1rem" }}>No sign-up required. Completely free.</p>
            </div>
          )}
          {step === "questions" && <QuestionCard q={QUESTIONS[currentQ]} value={answers[QUESTIONS[currentQ].id] || ""} onChange={handleAnswer} onNext={handleNext} onBack={handleBack} isFirst={currentQ === 0} isLast={currentQ === QUESTIONS.length - 1} questionNumber={currentQ + 1} total={QUESTIONS.length} />}
          {step === "loading" && <LoadingReport />}
          {step === "report" && <ReportView report={report} answers={answers} onContactSubmit={handleContactSubmit} contactSubmitted={contactSubmitted} sending={sending} />}
          {error && <p style={{ color: "#ef4444", fontFamily: s.sans, marginTop: "1rem", fontSize: "0.9rem" }}>{error}</p>}
        </div>
        <p style={{ fontFamily: s.mono, color: "#1f2937", fontSize: "0.7rem", marginTop: "2rem", letterSpacing: "0.08em" }}>© COSEEK · FINANCE MOT</p>
      </div>
    </>
  );
}

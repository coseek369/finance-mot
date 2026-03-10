import { useState } from "react";

const QUESTIONS = [
  {
    id: "turnover",
    question: "What is your approximate annual turnover?",
    subtitle: "A rough ballpark is absolutely fine",
    type: "select",
    options: ["Under £250k", "£250k – £500k", "£500k – £1m", "£1m – £3m", "£3m – £10m", "Over £10m"]
  },
  {
    id: "employees",
    question: "How many people work in the business?",
    subtitle: "Include yourself",
    type: "select",
    options: ["Just me", "2–5", "6–15", "16–50", "50+"]
  },
  {
    id: "software",
    question: "What software do you use for bookkeeping or accounts?",
    subtitle: "Pick the closest match",
    type: "select",
    options: ["Xero", "QuickBooks", "Sage", "Excel / spreadsheets only", "My accountant handles it", "Nothing formal"]
  },
  {
    id: "close_time",
    question: "How long after month end do you know how profitable that month was?",
    subtitle: "Be honest — this is one of the most telling numbers",
    type: "select",
    options: ["Within a week", "2–3 weeks", "A month or more", "I only find out at year end", "I'm not really sure"]
  },
  {
    id: "cash_forecast",
    question: "Do you have a cash flow forecast?",
    subtitle: "Even a rough one counts",
    type: "select",
    options: ["Yes, I update it regularly", "I have one but rarely use it", "No, but I'd like one", "No and I've never needed one", "What's a cash flow forecast?"]
  },
  {
    id: "job_margin",
    question: "Do you know which jobs or services make you the most money?",
    subtitle: "Margin visibility by job type or customer",
    type: "select",
    options: ["Yes, clearly", "I have a rough idea", "Not really", "No idea at all"]
  },
  {
    id: "busy_skint",
    question: "Have you ever had a period where you were busy but still felt short on cash?",
    subtitle: "This is more common than people admit",
    type: "select",
    options: ["Yes, regularly", "Yes, once or twice", "Not really", "Never"]
  },
  {
    id: "reporting",
    question: "What financial reporting do you currently receive?",
    subtitle: "Select the closest description",
    type: "select",
    options: [
      "Regular monthly management accounts",
      "Occasional reports from my bookkeeper",
      "Year-end accounts only",
      "I look at my bank balance",
      "Nothing formal"
    ]
  },
  {
    id: "biggest_headache",
    question: "What is your biggest financial headache right now?",
    subtitle: "In your own words — no wrong answers",
    type: "text",
    placeholder: "e.g. I never know if I'm actually making money until my accountant tells me..."
  },
  {
    id: "fix_90_days",
    question: "If you could fix one financial problem in the next 90 days, what would it be?",
    subtitle: "This helps us prioritise what matters most to you",
    type: "text",
    placeholder: "e.g. I want to know my numbers without having to chase my bookkeeper..."
  }
];

const ProgressBar = ({ current, total }) => (
  <div style={{ marginBottom: "2rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Question {current} of {total}
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#10b981", letterSpacing: "0.1em" }}>
        {Math.round((current / total) * 100)}%
      </span>
    </div>
    <div style={{ height: "3px", background: "#1f2937", borderRadius: "2px" }}>
      <div style={{
        height: "100%",
        width: `${(current / total) * 100}%`,
        background: "linear-gradient(90deg, #10b981, #34d399)",
        borderRadius: "2px",
        transition: "width 0.5s ease"
      }} />
    </div>
  </div>
);

const QuestionCard = ({ q, value, onChange, onNext, onBack, isFirst, isLast, questionNumber, total }) => {
  const canProceed = value && value.trim() !== "";

  return (
    <div style={{ animation: "slideIn 0.4s ease" }}>
      <ProgressBar current={questionNumber} total={total} />

      <div style={{ marginBottom: "0.5rem" }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.7rem",
          color: "#10b981",
          letterSpacing: "0.15em",
          textTransform: "uppercase"
        }}>
          {String(questionNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.4rem, 3vw, 2rem)",
        color: "#f9fafb",
        fontWeight: 700,
        lineHeight: 1.3,
        marginBottom: "0.75rem"
      }}>
        {q.question}
      </h2>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "#9ca3af",
        fontSize: "0.9rem",
        marginBottom: "2rem"
      }}>
        {q.subtitle}
      </p>

      {q.type === "select" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: "1rem 1.25rem",
                background: value === opt ? "rgba(16, 185, 129, 0.15)" : "rgba(255,255,255,0.03)",
                border: value === opt ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: value === opt ? "#10b981" : "#d1d5db",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}
            >
              <span style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: value === opt ? "2px solid #10b981" : "2px solid #374151",
                background: value === opt ? "#10b981" : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {value === opt && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
              </span>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          style={{
            width: "100%",
            padding: "1rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#f9fafb",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: 1.6
          }}
        />
      )}

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        {!isFirst && (
          <button onClick={onBack} style={{
            padding: "0.875rem 1.5rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            color: "#9ca3af",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}>
            ← Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            flex: 1,
            padding: "0.875rem 2rem",
            background: canProceed ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: "8px",
            color: canProceed ? "#fff" : "#4b5563",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            letterSpacing: "0.02em"
          }}
        >
          {isLast ? "Generate My Finance MOT →" : "Next →"}
        </button>
      </div>
    </div>
  );
};

const LoadingReport = () => {
  const steps = [
    "Analysing your business profile...",
    "Identifying cash flow risks...",
    "Reviewing your reporting gaps...",
    "Calculating your MOT score...",
    "Building your action plan..."
  ];
  const [step, setStep] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, steps.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <div style={{
        width: "64px",
        height: "64px",
        border: "3px solid rgba(16,185,129,0.2)",
        borderTop: "3px solid #10b981",
        borderRadius: "50%",
        margin: "0 auto 2rem",
        animation: "spin 1s linear infinite"
      }} />
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        color: "#f9fafb",
        fontSize: "1.5rem",
        marginBottom: "1rem"
      }}>
        Running your Finance MOT
      </h3>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        color: "#10b981",
        fontSize: "0.85rem",
        letterSpacing: "0.05em"
      }}>
        {steps[step]}
      </p>
    </div>
  );
};

const ReportView = ({ report, answers }) => {
  const sections = report.split("\n\n").filter(s => s.trim());

  return (
    <div style={{ animation: "slideIn 0.5s ease" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "linear-gradient(135deg, #10b981, #059669)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.25rem",
          flexShrink: 0
        }}>✓</div>
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            color: "#f9fafb",
            fontSize: "1.5rem",
            margin: 0
          }}>Your Finance MOT Report</h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            color: "#6b7280",
            fontSize: "0.75rem",
            margin: "0.25rem 0 0",
            letterSpacing: "0.1em"
          }}>POWERED BY COSEEK AI</p>
        </div>
      </div>

      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "#d1d5db",
        lineHeight: 1.8,
        fontSize: "0.95rem"
      }}>
        {sections.map((section, i) => {
          const isHeader = section.startsWith("**") || section.startsWith("#");
          const cleaned = section.replace(/\*\*/g, "").replace(/^#+\s/, "");

          if (cleaned.includes(":") && cleaned.split(":")[0].length < 50 && !cleaned.includes("\n")) {
            const [label, ...rest] = cleaned.split(":");
            return (
              <div key={i} style={{
                padding: "1rem 1.25rem",
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.15)",
                borderRadius: "8px",
                marginBottom: "1rem"
              }}>
                <span style={{ color: "#10b981", fontWeight: 600 }}>{label}:</span>
                <span>{rest.join(":")}</span>
              </div>
            );
          }

          if (section.length < 80 && (section.toUpperCase() === section || section.startsWith("**"))) {
            return (
              <h3 key={i} style={{
                fontFamily: "'Playfair Display', serif",
                color: "#f9fafb",
                fontSize: "1.15rem",
                marginTop: "1.75rem",
                marginBottom: "0.75rem"
              }}>{cleaned}</h3>
            );
          }

          return (
            <p key={i} style={{ marginBottom: "1rem" }}>{cleaned}</p>
          );
        })}
      </div>

      <div style={{
        marginTop: "2.5rem",
        padding: "1.5rem",
        background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))",
        border: "1px solid rgba(16,185,129,0.25)",
        borderRadius: "12px",
        textAlign: "center"
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          color: "#f9fafb",
          fontSize: "1.15rem",
          marginBottom: "0.5rem"
        }}>Want to act on this?</p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "#9ca3af",
          fontSize: "0.9rem",
          marginBottom: "1.25rem"
        }}>Book a free 30-minute call to walk through your results and build a plan.</p>
        <button style={{
          padding: "0.875rem 2rem",
          background: "linear-gradient(135deg, #10b981, #059669)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer",
          letterSpacing: "0.02em"
        }}>
          Book a Free Call →
        </button>
      </div>
    </div>
  );
};

export default function CoseekFinanceMOT() {
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = () => setStep("questions");

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentQ].id]: val }));
  };

  const handleNext = async () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setStep("loading");
      setLoading(true);
      await generateReport();
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(q => q - 1);
  };

  const generateReport = async () => {
    const summary = QUESTIONS.map(q => `${q.question}: ${answers[q.id] || "Not answered"}`).join("\n");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: summary })
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #030712; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#030712",
        backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(5,150,105,0.04) 0%, transparent 50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem"
      }}>

        {/* Header */}
        <div style={{
          width: "100%",
          maxWidth: "640px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "3rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem"
            }}>⚡</div>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              color: "#f9fafb",
              fontSize: "0.9rem",
              fontWeight: 500,
              letterSpacing: "0.05em"
            }}>COSEEK</span>
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            color: "#6b7280",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}>Finance MOT</span>
        </div>

        {/* Main Card */}
        <div style={{
          width: "100%",
          maxWidth: "640px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "clamp(1.5rem, 5vw, 2.5rem)",
          backdropFilter: "blur(10px)"
        }}>

          {step === "intro" && (
            <div style={{ animation: "slideIn 0.5s ease" }}>
              <div style={{
                display: "inline-block",
                padding: "0.35rem 0.75rem",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "20px",
                marginBottom: "1.5rem"
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "#10b981",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>Free · Takes 5 minutes</span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#f9fafb",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: "1.25rem"
              }}>
                Is your business<br />
                <span style={{ color: "#10b981" }}>financially roadworthy?</span>
              </h1>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#9ca3af",
                fontSize: "1rem",
                lineHeight: 1.7,
                marginBottom: "2rem"
              }}>
                The Coseek Finance MOT checks your business finances the same way a mechanic checks your car — identifying what's working, what needs attention, and what could leave you stranded.
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                marginBottom: "2.5rem"
              }}>
                {[
                  { icon: "🔍", label: "10 questions" },
                  { icon: "⚡", label: "Instant report" },
                  { icon: "🎯", label: "Clear actions" }
                ].map(item => (
                  <div key={item.label} style={{
                    padding: "1rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>{item.icon}</div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      color: "#6b7280",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em"
                    }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                style={{
                  width: "100%",
                  padding: "1rem 2rem",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "opacity 0.2s"
                }}
              >
                Start My Finance MOT →
              </button>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#4b5563",
                fontSize: "0.8rem",
                textAlign: "center",
                marginTop: "1rem"
              }}>
                No sign-up required. Completely free.
              </p>
            </div>
          )}

          {step === "questions" && (
            <QuestionCard
              q={QUESTIONS[currentQ]}
              value={answers[QUESTIONS[currentQ].id] || ""}
              onChange={handleAnswer}
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentQ === 0}
              isLast={currentQ === QUESTIONS.length - 1}
              questionNumber={currentQ + 1}
              total={QUESTIONS.length}
            />
          )}

          {step === "loading" && <LoadingReport />}

          {step === "report" && <ReportView report={report} answers={answers} />}

          {error && (
            <p style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif", marginTop: "1rem", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}
        </div>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          color: "#1f2937",
          fontSize: "0.7rem",
          marginTop: "2rem",
          letterSpacing: "0.08em"
        }}>
          © COSEEK · FINANCE MOT
        </p>
      </div>
    </>
  );
}

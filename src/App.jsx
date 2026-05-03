// ============================================================
// CivicGuide — AI-Powered Election Process Assistant
// Single-file React component using Anthropic Claude API
// API key is injected by the environment
// ============================================================

import { useState, useRef, useEffect } from "react";

// ── Google Fonts ─────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ── Global Styles ─────────────────────────────────────────────
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', sans-serif; background: #0b1120; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-badge {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .message-enter { animation: fadeSlideIn 0.3s ease forwards; }

  .topic-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    border-color: #4f8ef7 !important;
  }
  .topic-card { transition: all 0.2s ease; }

  .send-btn:hover:not(:disabled) { background: #3b7de8 !important; transform: scale(1.05); }
  .send-btn:active:not(:disabled) { transform: scale(0.97); }
  .send-btn { transition: all 0.2s ease; }

  .new-chat-btn:hover { background: rgba(79,142,247,0.15) !important; }
  .new-chat-btn { transition: background 0.2s ease; }

  .sidebar-toggle:hover { background: rgba(255,255,255,0.08) !important; }
  .sidebar-toggle { transition: all 0.2s ease; }

  textarea:focus { outline: none; }

  .prose p { margin-bottom: 0.6em; }
  .prose p:last-child { margin-bottom: 0; }
  .prose ul, .prose ol { padding-left: 1.2em; margin: 0.4em 0; }
  .prose li { margin-bottom: 0.3em; }
`;

const styleEl = document.createElement("style");
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

// ── Constants ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are CivicGuide, a friendly, accurate, and strictly nonpartisan election process assistant. You only help users understand how elections work — registration, voting methods, timelines, ballot counting, and certification. Never comment on candidates, parties, or political opinions. If asked, politely decline and redirect to the process. Default to the United States if no country is mentioned. Be concise, warm, and use numbered steps or bullet points when explaining processes. Use emojis sparingly (🗳️ ✅ 📋 📅). Format your responses with proper line breaks for readability.`;

const WELCOME_MESSAGE =
  "Hi, I'm CivicGuide 🗳️ — your nonpartisan guide to understanding how elections work. Whether you're a first-time voter or just want to understand the process better, I'm here to help.\n\nAsk me anything about registration, voting methods, timelines, how votes are counted, and more. What would you like to know?";

const QUICK_TOPICS = [
  { emoji: "📋", label: "How to Register",         question: "How do I register to vote?" },
  { emoji: "📅", label: "Election Timeline",        question: "Walk me through the complete election timeline from start to finish." },
  { emoji: "🗳️", label: "Voting Methods",           question: "What are the different ways I can cast my vote?" },
  { emoji: "🔢", label: "How Votes Are Counted",    question: "How are votes counted and verified after election day?" },
  { emoji: "⚖️", label: "Primary vs General",       question: "What is the difference between a primary and a general election?" },
  { emoji: "🏛️", label: "Electoral College",        question: "How does the Electoral College work?" },
];

// ── Typing Indicator ──────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: "#4f8ef7",
            display: "inline-block",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────
function MessageBubble({ message }) {
  const isUser = message.role === "user";

  // Render newlines as <br /> in assistant messages
  const renderContent = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <div
      className="message-enter"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #1e3a6e, #4f8ef7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0, marginBottom: 2,
            boxShadow: "0 2px 8px rgba(79,142,247,0.3)",
          }}
          aria-label="CivicGuide avatar"
        >
          🗳️
        </div>
      )}

      {/* Bubble */}
      <div
        className="prose"
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #2563eb, #4f8ef7)"
            : "rgba(255,255,255,0.06)",
          color: isUser ? "#fff" : "#cbd5e1",
          fontSize: 14.5,
          lineHeight: 1.65,
          border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(4px)",
          boxShadow: isUser
            ? "0 4px 14px rgba(37,99,235,0.3)"
            : "0 2px 8px rgba(0,0,0,0.2)",
          wordBreak: "break-word",
        }}
      >
        {renderContent(message.content)}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ onTopicClick, onNewChat, isOpen, onClose }) {
  return (
    <>
      {/* Overlay — shown when sidebar is open (acts as backdrop to close) */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      <aside
        style={{
          width: 270,
          background: "linear-gradient(180deg, #0d1829 0%, #0b1120 100%)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column",
          padding: "24px 16px",
          flexShrink: 0,
          position: "fixed",
          top: 0, left: 0,
          height: "100vh",
          zIndex: 50,
          // Slide in/out via transform
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isOpen ? "4px 0 32px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Logo + Close button row */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22, fontWeight: 700,
                color: "#f1f5f9", letterSpacing: "-0.3px",
                marginBottom: 4,
              }}
            >
              CivicGuide 🗳️
            </h1>
            <p style={{ fontSize: 12, color: "#64748b", letterSpacing: "0.3px" }}>
              Your nonpartisan election guide
            </p>
          </div>
          {/* Close button */}
          <button
            className="sidebar-toggle"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#64748b", fontSize: 16,
              flexShrink: 0, marginTop: 2,
            }}
          >
            ✕
          </button>
        </div>

        {/* New Conversation */}
        <button
          className="new-chat-btn"
          onClick={onNewChat}
          aria-label="Start a new conversation"
          style={{
            width: "100%", padding: "9px 14px",
            borderRadius: 10, border: "1px solid rgba(79,142,247,0.3)",
            background: "transparent", color: "#4f8ef7",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 24, fontFamily: "'Source Sans 3', sans-serif",
          }}
        >
          <span style={{ fontSize: 16 }}>＋</span> New Conversation
        </button>

        {/* Quick Topics */}
        <p
          style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "1px",
            color: "#475569", textTransform: "uppercase", marginBottom: 10,
          }}
        >
          Quick Topics
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.label}
              className="topic-card"
              onClick={() => { onTopicClick(topic.question); onClose(); }}
              aria-label={`Ask about ${topic.label}`}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "9px 12px",
                color: "#94a3b8", fontSize: 13, fontWeight: 500,
                cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 9,
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              <span style={{ fontSize: 16 }}>{topic.emoji}</span>
              {topic.label}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          style={{
            fontSize: 11, color: "#334155", marginTop: 20,
            lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 16,
          }}
        >
          CivicGuide is nonpartisan and does not endorse any candidate or party.
        </p>
      </aside>
    </>
  );
}

// ── Chat Input ────────────────────────────────────────────────
function ChatInput({ value, onChange, onSend, isLoading }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [value]);

  return (
    <div
      style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "flex-end", gap: 10,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14, padding: "10px 14px",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(79,142,247,0.5)"}
        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about elections…"
          disabled={isLoading}
          aria-label="Type your question about elections"
          rows={1}
          style={{
            flex: 1, background: "transparent", border: "none",
            color: "#e2e8f0", fontSize: 14, lineHeight: 1.6,
            resize: "none", fontFamily: "'Source Sans 3', sans-serif",
            maxHeight: 120,
          }}
        />
        <button
          className="send-btn"
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          aria-label="Send message"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: value.trim() && !isLoading ? "#2563eb" : "#1e293b",
            border: "none", cursor: value.trim() && !isLoading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, color: "#fff", fontSize: 16,
          }}
        >
          ➤
        </button>
      </div>
      <p style={{ fontSize: 11, color: "#334155", marginTop: 8, textAlign: "center" }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

// ── Chat Window ───────────────────────────────────────────────
function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        flex: 1, overflowY: "auto", padding: "24px 20px",
      }}
      role="log"
      aria-live="polite"
      aria-label="Conversation"
    >
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {isLoading && (
        <div
          className="message-enter"
          style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 16 }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #1e3a6e, #4f8ef7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, flexShrink: 0,
              boxShadow: "0 2px 8px rgba(79,142,247,0.3)",
            }}
          >
            🗳️
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px 18px 18px 4px",
            }}
          >
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Send a message ──────────────────────────────────────────
  const sendMessage = async (text) => {
    const userText = (text || inputValue).trim();
    if (!userText || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build the payload — only include user/assistant turns (skip static welcome for API)
      const apiMessages = newMessages
        .filter((m) => !(m.role === "assistant" && m.content === WELCOME_MESSAGE))
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // API key is injected by the environment
        },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const assistantText =
        data.content?.[0]?.text || "I didn't catch that — please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      console.error("CivicGuide API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Quick topic handler ─────────────────────────────────────
  const handleTopicClick = (question) => {
    sendMessage(question);
  };

  // ── New conversation ────────────────────────────────────────
  const handleNewChat = () => {
    setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
    setInputValue("");
  };

  return (
    <div
      style={{
        display: "flex", height: "100vh", width: "100vw",
        background: "#0b1120", overflow: "hidden",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      {/* Sidebar — slides in/out via isOpen */}
      <Sidebar
        onTopicClick={handleTopicClick}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Panel */}
      <main
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          minWidth: 0, position: "relative",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(11,17,32,0.9)", backdropFilter: "blur(10px)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Sidebar toggle button — always visible */}
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              style={{
                background: sidebarOpen ? "rgba(79,142,247,0.12)" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: sidebarOpen ? "#4f8ef7" : "#64748b",
                fontSize: 18, flexShrink: 0,
              }}
            >
              ☰
            </button>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18, fontWeight: 700, color: "#f1f5f9",
              }}
            >
              CivicGuide
            </h2>
          </div>

          <span
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.5px",
              color: "#22c55e", background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              padding: "3px 10px", borderRadius: 20,
              animation: "pulse-badge 3s ease-in-out infinite",
            }}
          >
            ● Nonpartisan &amp; Neutral
          </span>
        </header>

        {/* Messages */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => sendMessage()}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
import { useState } from "react";
import api from "../services/api";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    const userMessage = cleanQuestion;

    setMessages((current) => [
      ...current,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await api.post("/rag/ask", {
        question: userMessage,
      });

      if (data.success) {
        setMessages((current) => [
          ...current,
          {
            type: "ai",
            text: data.answer,
            sources: data.sources || [],
          },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          {
            type: "ai",
            text:
              data.message ||
              "I couldn't answer that from your saved bookmarks.",
          },
        ]);
      }
    } catch (error) {
      console.error("Ask AI error:", error);

      setMessages((current) => [
        ...current,
        {
          type: "ai",
          text:
            error.message ||
            "Something went wrong while asking your bookmarks.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page ask-page">
      <div className="ask-header">
        <div className="ai-orb">✦</div>

        <span className="section-kicker">
          YOUR PERSONAL LEARNING ASSISTANT
        </span>

        <h1>Ask your bookmarks.</h1>

        <p>
          Ask questions and LearnFlow will find relevant
          knowledge from the resources you've saved.
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="empty-symbol">✦</div>

              <h3>What do you want to understand?</h3>

              <p>
                Try asking about something you've previously
                saved.
              </p>

              <div className="suggestions">
                <button
                  onClick={() =>
                    setQuestion(
                      "Explain recursion using my saved resources"
                    )
                  }
                >
                  Explain recursion
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "What should I revise today?"
                    )
                  }
                >
                  What should I revise?
                </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.type}`}
            >
              <div>{message.text}</div>

              {message.type === "ai" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="message-sources">
                    <div className="sources-title">
                      Sources from your bookmarks
                    </div>

                    {message.sources.map((source) => (
                      <div
                        key={source.id}
                        className="source-item"
                      >
                        <div className="source-title">
                          {source.title}
                        </div>

                        {source.topic && (
                          <div className="source-topic">
                            {source.topic}
                          </div>
                        )}

                        {source.domain && (
                          <div className="source-domain">
                            {source.domain}
                          </div>
                        )}

                        {source.relevanceScore !==
                          undefined && (
                            <div className="source-relevance">
                              Relevance:{" "}
                              {source.relevanceScore}
                            </div>
                          )}

                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open resource →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div>
                Thinking from your saved bookmarks...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
            placeholder="Ask something from your saved knowledge..."
            disabled={loading}
          />

          <button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
          >
            {loading ? "..." : "→"}
          </button>
        </div>
      </div>
    </div>
  );
}
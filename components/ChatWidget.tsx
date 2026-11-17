"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { reply } from "@/lib/chatbot";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content: "Hello! I'm the Thaba Lerato assistant. Ask me about rates, availability, activities or getting here.",
};

const SUGGESTIONS = ["What are your rates?", "Which activities can I add?", "Do I pay a deposit?"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const content = text.trim();
    if (!content || typing) return;
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setTyping(true);
    // A short pause so the answer feels like a conversation.
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply(content) }]);
      setTyping(false);
    }, 700);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Thaba Lerato"
          className="flex h-[min(540px,calc(100vh-8rem))] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_70px_rgba(30,42,34,0.3)]"
        >
          <div className="flex items-center gap-3 bg-bush px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9Z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold text-white">Thaba Lerato Assistant</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · Instant answers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-clay px-3.5 py-2.5 text-sm text-white"
                    : "w-fit max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-sand px-3.5 py-2.5 text-sm leading-relaxed text-bush"
                }
              >
                {m.content}
              </p>
            ))}
            {typing && (
              <p className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-sand px-4 py-3.5" aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="pulse-soft h-1.5 w-1.5 rounded-full bg-clay" style={{ animationDelay: `${d * 0.2}s` }} />
                ))}
              </p>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-bush/25 px-3 py-1.5 text-xs font-medium text-bush transition-colors hover:bg-sand"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3">
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Type your message…"
              className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-bush outline-none placeholder:text-muted/60 focus:border-clay"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay text-white transition-colors hover:bg-clay-deep disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask us anything"}
        aria-expanded={open}
        className="flex h-14 items-center gap-2 rounded-full bg-bush px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(30,42,34,0.35)] transition-colors hover:bg-bush-soft"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </svg>
        {!open && <span className="hidden sm:inline">Ask us anything</span>}
      </button>
    </div>
  );
}

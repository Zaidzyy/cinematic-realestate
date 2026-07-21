"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type Lite = {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  beds: number;
  type: string;
  image: string;
};

const SUGGESTIONS = [
  "A quiet place with mountain views under $5M",
  "Somewhere on the water for summers",
  "Best value in the collection",
];

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [cards, setCards] = useState<Lite[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, cards]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setBusy(true);
    setCards([]);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");

      const header = res.headers.get("x-listings");
      if (header) {
        try {
          setCards(JSON.parse(decodeURIComponent(header)));
        } catch {}
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "The concierge is unavailable right now. (Check that GOOGLE_GENERATIVE_AI_API_KEY is set.)",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString()}`;

  return (
    <>
      <button
        className={`cc-fab ${open ? "cc-fab--hidden" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open the concierge"
      >
        <span className="cc-fab__dot" />
        Ask the concierge
      </button>

      <div className={`cc ${open ? "cc--open" : ""}`} role="dialog" aria-label="Concierge">
        <div className="cc__head">
          <div>
            <span className="cc__eyebrow">Kavya Estates</span>
            <h3 className="cc__title">Concierge</h3>
          </div>
          <button className="cc__close" onClick={() => setOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="cc__body" ref={scroller}>
          {messages.length === 0 && (
            <div className="cc__intro">
              <p>
                Tell me how you want to live and I&apos;ll find the residence. Try:
              </p>
              <div className="cc__suggest">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="cc__chip">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`cc__msg cc__msg--${m.role}`}>
              {m.content || <span className="cc__typing">…</span>}
            </div>
          ))}

          {cards.length > 0 && (
            <div className="cc__cards">
              {cards.map((c) => (
                <a key={c.id} href="#clients" className="cc__card" onClick={() => setOpen(false)}>
                  <span
                    className="cc__cardImg"
                    style={{ backgroundImage: `url(${c.image})` }}
                  />
                  <span className="cc__cardMeta">
                    <b>{c.name}</b>
                    <span>
                      {c.city}, {c.country}
                    </span>
                    <span className="cc__cardStats">
                      {fmt(c.price)} · {c.beds} bed · {c.type}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        <form
          className="cc__form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            className="cc__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your ideal home…"
            disabled={busy}
          />
          <button className="cc__send" disabled={busy || !input.trim()} aria-label="Send">
            {busy ? "…" : "↑"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .cc-fab {
          position: fixed;
          right: clamp(16px, 3vw, 28px);
          bottom: clamp(16px, 3vw, 28px);
          z-index: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 20px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgba(11, 11, 12, 0.8);
          backdrop-filter: blur(12px);
          color: var(--fg);
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease,
            background 0.3s ease;
        }
        .cc-fab:hover {
          background: var(--accent);
          border-color: var(--accent);
        }
        .cc-fab--hidden {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          pointer-events: none;
        }
        .cc-fab__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }
        .cc-fab:hover .cc-fab__dot {
          background: #fff;
          box-shadow: none;
        }
        .cc {
          position: fixed;
          right: clamp(12px, 3vw, 28px);
          bottom: clamp(12px, 3vw, 28px);
          z-index: 601;
          width: min(400px, calc(100vw - 24px));
          height: min(600px, calc(100vh - 24px));
          display: flex;
          flex-direction: column;
          background: var(--bg-soft);
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }
        .cc--open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .cc__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid var(--line);
        }
        .cc__eyebrow {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--fg-dim);
        }
        .cc__title {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          font-size: 20px;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-top: 2px;
        }
        .cc__close {
          background: none;
          border: none;
          color: var(--fg-dim);
          cursor: pointer;
          font-size: 15px;
        }
        .cc__close:hover {
          color: var(--fg);
        }
        .cc__body {
          flex: 1;
          overflow-y: auto;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cc__intro {
          color: var(--fg-dim);
          font-size: 14px;
          line-height: 1.5;
        }
        .cc__suggest {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cc__chip {
          text-align: left;
          padding: 10px 14px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: transparent;
          color: var(--fg);
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .cc__chip:hover {
          border-color: var(--accent);
          background: rgba(229, 86, 58, 0.08);
        }
        .cc__msg {
          max-width: 86%;
          padding: 11px 14px;
          border-radius: 13px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .cc__msg--user {
          align-self: flex-end;
          background: var(--accent);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .cc__msg--assistant {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.04);
          color: var(--fg);
          border: 1px solid var(--line);
          border-bottom-left-radius: 4px;
        }
        .cc__typing {
          color: var(--fg-dim);
        }
        .cc__cards {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 2px;
        }
        .cc__card {
          display: flex;
          gap: 12px;
          padding: 8px;
          border: 1px solid var(--line);
          border-radius: 12px;
          align-items: center;
          transition: border-color 0.25s ease;
        }
        .cc__card:hover {
          border-color: var(--accent);
        }
        .cc__cardImg {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background-size: cover;
          background-position: center;
          background-color: var(--bg);
          flex: none;
        }
        .cc__cardMeta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 13px;
          color: var(--fg-dim);
        }
        .cc__cardMeta b {
          color: var(--fg);
          font-size: 14px;
        }
        .cc__cardStats {
          color: var(--accent);
          font-size: 12px;
        }
        .cc__form {
          display: flex;
          gap: 8px;
          padding: 14px;
          border-top: 1px solid var(--line);
        }
        .cc__input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
          color: var(--fg);
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          outline: none;
        }
        .cc__input:focus {
          border-color: var(--accent);
        }
        .cc__send {
          width: 44px;
          border: none;
          border-radius: 10px;
          background: var(--accent);
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .cc__send:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `}</style>
    </>
  );
}

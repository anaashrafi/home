import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { fetchRepos } from "../../hooks/useGitHub";
import {
  EXPERIENCES, CURRENT_ROLE, ALL_SKILLS, CERTIFICATIONS, PAGES, LINKS, CONTACT_EMAIL, LOCATION, FOCUS_AREAS,
  tenureMonths, formatTenure, levelLabel,
} from "../../data/profile";

const PROMPT = "guest@anurag:~$";
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Line = ({ children, tone }) => <div className={`term-out ${tone ? `term-${tone}` : ""}`}>{children}</div>;

const Bar = ({ value }) => {
  const filled = Math.round(value / 10);
  return (
    <span className="term-bar" aria-label={`${value}%`}>
      <span className="term-bar-fill">{"█".repeat(filled)}</span>
      <span className="term-bar-empty">{"░".repeat(10 - filled)}</span>
    </span>
  );
};

/* Command registry. Each `run` returns React nodes (or a Promise of them). */
const buildCommands = ({ navigate, setTheme, resolvedTheme }) => {
  const pageSlugs = PAGES.map((p) => (p.to === "/" ? "home" : p.to.slice(1)));

  const commands = {
    help: {
      desc: "list available commands",
      run: () => (
        <div className="term-help">
          {Object.entries(commands)
            .filter(([, c]) => !c.hidden)
            .map(([name, c]) => (
              <div key={name}>
                <span className="term-cmd">{name.padEnd(12, " ")}</span>
                <span className="term-dim">{c.desc}</span>
              </div>
            ))}
          <div className="term-dim" style={{ marginTop: 6 }}>Tip: ↑/↓ for history, Tab to autocomplete.</div>
        </div>
      ),
    },
    whoami: {
      desc: "who is this person?",
      run: () => (
        <>
          <Line>Anurag Vaidhya</Line>
          <Line tone="dim">{CURRENT_ROLE.company} · {LOCATION.city}</Line>
        </>
      ),
    },
    experience: {
      desc: "career history",
      run: () =>
        [...EXPERIENCES].reverse().map((e) => (
          <Line key={e.id}>
            <span className="term-accent">{e.start.slice(0, 4)}</span>{" "}
            {e.company} <span className="term-dim">— {e.position} ({e.end ? formatTenure(tenureMonths(e)) : "current"})</span>
          </Line>
        )),
    },
    focus: {
      desc: "core focus, in priority order",
      run: () =>
        FOCUS_AREAS.map((f, i) => (
          <Line key={f.id}>
            <span className="term-accent">{i + 1}.</span> {f.label.padEnd(22, "\u00a0")}<span className="term-dim">{f.detail}</span>
          </Line>
        )),
    },
    skills: {
      desc: "core skills (cloud first)",
      run: () =>
        ALL_SKILLS
          .filter((s) => s.featured || s.domain === "Cloud")
          .slice(0, 8)
          .map((s) => (
            <Line key={s.name}>
              <span className="term-skill">{s.name.padEnd(20, " ")}</span>
              <Bar value={s.level} /> <span className="term-dim">{levelLabel(s.level)}</span>
            </Line>
          )),
    },
    certs: {
      desc: "certifications",
      run: () =>
        CERTIFICATIONS.map((c) => (
          <Line key={c.name}>
            <span className={c.status === "Active" ? "term-ok" : "term-dim"}>{c.status === "Active" ? "✓" : "○"}</span> {c.name}{" "}
            <span className="term-dim">({c.year})</span>
          </Line>
        )),
    },
    projects: {
      desc: "recent GitHub repos (live)",
      run: () =>
        fetchRepos()
          .then((repos) =>
            repos.slice(0, 5).map((r) => (
              <Line key={r.id}>
                <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="term-link">{r.name}</a>{" "}
                <span className="term-dim">{r.language || ""}{r.stargazers_count > 0 ? ` ★${r.stargazers_count}` : ""}</span>
              </Line>
            ))
          )
          .catch(() => <Line tone="err">GitHub is rate-limiting right now — try `cd projects`.</Line>),
    },
    contact: {
      desc: "ways to reach me",
      run: () => (
        <>
          <Line>email&nbsp;&nbsp;&nbsp;&nbsp;<a className="term-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></Line>
          <Line>linkedin&nbsp;<a className="term-link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">/in/anurag-vaidhya</a></Line>
          <Line>github&nbsp;&nbsp;&nbsp;<a className="term-link" href={LINKS.github} target="_blank" rel="noopener noreferrer">@anuu1989</a></Line>
        </>
      ),
    },
    resume: {
      desc: "open my resume (PDF)",
      run: () => {
        window.open(LINKS.resume, "_blank", "noopener,noreferrer");
        return <Line tone="ok">Opening resume.pdf…</Line>;
      },
    },
    ls: {
      desc: "list pages",
      run: () => <Line>{pageSlugs.map((s) => <span key={s} className="term-dir">{s}/ </span>)}</Line>,
    },
    cd: {
      desc: "navigate, e.g. `cd projects`",
      run: (arg) => {
        const slug = (arg || "").replace(/^\/|\/$/g, "").toLowerCase();
        if (!slug || slug === "~") return <Line tone="dim">Already home.</Line>;
        const idx = pageSlugs.indexOf(slug);
        if (idx === -1) return <Line tone="err">cd: no such page: {arg}. Try `ls`.</Line>;
        setTimeout(() => navigate(PAGES[idx].to), 250);
        return <Line tone="ok">→ /{slug === "home" ? "" : slug}</Line>;
      },
    },
    theme: {
      desc: "toggle light/dark (or `theme dark`)",
      run: (arg) => {
        const next = arg === "dark" || arg === "light" ? arg : resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
        return <Line tone="ok">Theme set to {next}.</Line>;
      },
    },
    date: {
      desc: `my local time (${LOCATION.city})`,
      run: () => (
        <Line>
          {new Date().toLocaleString("en-AU", { timeZone: LOCATION.timeZone, dateStyle: "full", timeStyle: "short" })}
        </Line>
      ),
    },
    clear: { desc: "clear the screen", run: () => null },
    sudo: {
      hidden: true,
      run: (arg) => {
        if (arg === "hire-me" || arg === "hire") {
          setTimeout(() => navigate("/contact"), 600);
          return <Line tone="ok">Permission granted. Redirecting to /contact…</Line>;
        }
        return <Line tone="err">guest is not in the sudoers file. This incident will be reported. (try `sudo hire-me`)</Line>;
      },
    },
    exit: { hidden: true, run: () => <Line tone="dim">There is no escape. Try `help`.</Line> },
  };

  // Aliases
  commands.exp = { ...commands.experience, hidden: true };
  commands.about = { ...commands.whoami, hidden: true };
  commands.stack = { ...commands.skills, hidden: true };
  commands["?"] = { ...commands.help, hidden: true };

  return commands;
};

const INTRO = [
  { cmd: "whoami" },
  { cmd: "focus" },
];

const InteractiveTerminal = () => {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [history, setHistory] = useState([]); // [{ id, cmd, output }]
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(null); // intro command being typed
  const [ready, setReady] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const idRef = useRef(0);

  const commandsRef = useRef(null);
  commandsRef.current = buildCommands({ navigate, setTheme, resolvedTheme });

  const execute = useCallback(async (raw, { limit } = {}) => {
    const trimmed = raw.trim();
    const id = ++idRef.current;
    if (!trimmed) {
      setHistory((h) => [...h, { id, cmd: "", output: null }]);
      return;
    }
    const [name, ...args] = trimmed.split(/\s+/);
    const command = commandsRef.current[name.toLowerCase()];
    if (name.toLowerCase() === "clear") {
      setHistory([]);
      return;
    }
    if (!command) {
      setHistory((h) => [...h, { id, cmd: trimmed, output: <Line tone="err">command not found: {name}. Type `help`.</Line> }]);
      return;
    }
    setHistory((h) => [...h, { id, cmd: trimmed, output: <Line tone="dim">…</Line> }]);
    let output = await command.run(args.join(" "));
    if (limit && Array.isArray(output)) output = output.slice(0, limit);
    setHistory((h) => h.map((entry) => (entry.id === id ? { ...entry, output } : entry)));
  }, []);

  // Intro: type a couple of commands, then hand over to the visitor.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setHistory([]);
      INTRO.forEach((step) => execute(step.cmd, step));
      setReady(true);
      return undefined;
    }
    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));

    (async () => {
      await wait(500);
      for (const step of INTRO) {
        for (let i = 1; i <= step.cmd.length; i++) {
          if (cancelled) return;
          setTyping(step.cmd.slice(0, i));
          await wait(70);
        }
        await wait(220);
        if (cancelled) return;
        setTyping(null);
        await execute(step.cmd, step);
        await wait(650);
      }
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [execute]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history, typing, ready]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;
    const value = input;
    setInput("");
    setHistoryIdx(-1);
    if (value.trim()) setCmdHistory((h) => [...h, value.trim()]);
    execute(value);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const idx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(cmdHistory[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === "Tab") {
      const parts = input.split(" ");
      if (parts.length === 1 && parts[0]) {
        const match = Object.keys(commandsRef.current).find((c) => c.startsWith(parts[0].toLowerCase()) && !commandsRef.current[c].hidden);
        if (match) {
          e.preventDefault();
          setInput(`${match} `);
        }
      } else if (parts[0] === "cd" && parts.length === 2) {
        const match = PAGES.map((p) => (p.to === "/" ? "home" : p.to.slice(1))).find((s) => s.startsWith(parts[1].toLowerCase()));
        if (match) {
          e.preventDefault();
          setInput(`cd ${match}`);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div className="term" onClick={() => ready && inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar-top">
        <span className="term-dots"><span></span><span></span><span></span></span>
        <span className="term-title">anurag — zsh — 80×24</span>
        <span className="term-badge">interactive</span>
      </div>
      <div className="term-body" ref={bodyRef} role="log" aria-live="polite" aria-label="Interactive terminal">
        {history.map((entry) => (
          <div key={entry.id} className="term-entry">
            <div className="term-line"><span className="term-prompt">{PROMPT}</span> {entry.cmd}</div>
            {entry.output}
          </div>
        ))}
        {typing !== null && (
          <div className="term-line"><span className="term-prompt">{PROMPT}</span> {typing}<span className="term-caret" /></div>
        )}
        {ready && (
          <>
            {history.length <= INTRO.length && (
              <div className="term-out term-hint">Your turn — type <span className="term-cmd">help</span> and press Enter.</div>
            )}
            <form className="term-line term-input-row" onSubmit={onSubmit}>
              <label htmlFor="term-input" className="term-prompt">{PROMPT}</label>
              <input
                id="term-input"
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Terminal command input"
                placeholder="help"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InteractiveTerminal;

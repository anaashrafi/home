import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useMountTransition } from '../hooks/useMountTransition';
import { fetchRepos } from '../hooks/useGitHub';
import { scoreItem } from '../utils/fuzzy';
import { PAGES, EXPERIENCES, ALL_SKILLS, CERTIFICATIONS, CONTACT_EMAIL, LINKS, levelLabel } from '../data/profile';

const RECENT_KEY = 'cmdk-recent';
const MAX_RECENT = 5;
const MAX_RESULTS = 40;

const GROUP_ORDER = ['Pages', 'Actions', 'Experience', 'Skills', 'Certifications', 'Projects'];

const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecent = (ids) => {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    /* best-effort */
  }
};

const Highlight = ({ text, indices }) => {
  if (!indices?.length) return text;
  const set = new Set(indices);
  return text.split('').map((ch, i) => (set.has(i) ? <mark key={i}>{ch}</mark> : <React.Fragment key={i}>{ch}</React.Fragment>));
};

const CommandPalette = ({ isOpen, onClose, onOpenShortcuts }) => {
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState(loadRecent);
  const [repos, setRepos] = useState([]);
  const [mounted, animateIn] = useMountTransition(isOpen);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Lazily pull repos (shared cache) the first time the palette opens.
  useEffect(() => {
    if (!isOpen || repos.length) return;
    fetchRepos().then(setRepos).catch(() => {});
  }, [isOpen, repos.length]);

  const allItems = useMemo(() => {
    const open = (url) => () => window.open(url, '_blank', 'noopener,noreferrer');
    return [
      ...PAGES.map((p) => ({ id: `page:${p.to}`, group: 'Pages', icon: p.icon, label: p.label, hint: p.to, run: () => navigate(p.to) })),
      { id: 'act:theme', group: 'Actions', icon: resolvedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon', label: `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`, keywords: 'theme dark light appearance', hint: 'Theme', run: toggleTheme },
      { id: 'act:copy-email', group: 'Actions', icon: 'fas fa-copy', label: 'Copy email address', keywords: `mail contact ${CONTACT_EMAIL}`, hint: CONTACT_EMAIL, run: () => navigator.clipboard?.writeText(CONTACT_EMAIL) },
      { id: 'act:email', group: 'Actions', icon: 'fas fa-paper-plane', label: 'Send an email', keywords: 'mail contact message', run: () => { window.location.href = `mailto:${CONTACT_EMAIL}`; } },
      { id: 'act:call', group: 'Actions', icon: 'fas fa-calendar-check', label: 'Book a call', keywords: 'calendly meeting schedule', hint: 'Calendly', run: open(LINKS.calendly) },
      { id: 'act:resume', group: 'Actions', icon: 'fas fa-file-arrow-down', label: 'Download resume', keywords: 'cv pdf', hint: 'PDF', run: open(LINKS.resume) },
      { id: 'act:github', group: 'Actions', icon: 'fab fa-github', label: 'Open GitHub profile', keywords: 'code repos', run: open(LINKS.github) },
      { id: 'act:linkedin', group: 'Actions', icon: 'fab fa-linkedin', label: 'Open LinkedIn', keywords: 'connect network', run: open(LINKS.linkedin) },
      { id: 'act:shortcuts', group: 'Actions', icon: 'fas fa-keyboard', label: 'Keyboard shortcuts', keywords: 'help keys', hint: '?', run: () => onOpenShortcuts?.() },
      ...EXPERIENCES.map((e) => ({
        id: `exp:${e.id}`, group: 'Experience', icon: 'fas fa-briefcase', label: e.company,
        keywords: `${e.position} ${e.technologies.join(' ')}`, hint: e.duration, run: () => navigate('/experience'),
      })),
      ...ALL_SKILLS.map((s) => ({
        id: `skill:${s.name}`, group: 'Skills', icon: 'fas fa-code', label: s.name,
        keywords: `${s.domain} ${s.tags.join(' ')}`, hint: `${levelLabel(s.level)} · ${s.category}`, run: () => navigate('/skills'),
      })),
      ...CERTIFICATIONS.map((c) => ({
        id: `cert:${c.name}`, group: 'Certifications', icon: 'fas fa-certificate', label: c.name,
        keywords: c.issuer, hint: `${c.issuer.split(' ')[0]} · ${c.year}`, run: () => navigate('/skills'),
      })),
      ...repos.map((r) => ({
        id: `repo:${r.id}`, group: 'Projects', icon: 'fas fa-book-bookmark', label: r.name,
        keywords: `${r.description || ''} ${r.language || ''} ${(r.topics || []).join(' ')}`, hint: r.language || 'repo', run: open(r.html_url),
      })),
    ];
  }, [navigate, resolvedTheme, toggleTheme, onOpenShortcuts, repos]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      const byId = Object.fromEntries(allItems.map((i) => [i.id, i]));
      const recentItems = recent.map((id) => byId[id]).filter(Boolean).map((i) => ({ ...i, section: 'Recent' }));
      const defaults = allItems.filter((i) => i.group === 'Pages' || i.group === 'Actions').map((i) => ({ ...i, section: i.group }));
      return [...recentItems, ...defaults];
    }
    return allItems
      .map((item) => {
        const match = scoreItem(q, item.label, item.keywords);
        return match ? { ...item, section: item.group, score: match.score, indices: match.indices } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group))
      .slice(0, MAX_RESULTS);
  }, [query, allItems, recent]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  // Focus once the panel is actually in the DOM (mount is deferred by useMountTransition).
  useEffect(() => {
    if (isOpen && mounted) inputRef.current?.focus();
  }, [isOpen, mounted]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const runItem = (item) => {
    if (!item) return;
    const next = [item.id, ...recent.filter((id) => id !== item.id)].slice(0, MAX_RECENT);
    setRecent(next);
    saveRecent(next);
    item.run();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runItem(results[activeIndex]);
    }
  };

  if (!mounted) return null;

  const isSearching = query.trim().length > 0;
  let lastSection = null;

  return (
    <div className={`cmdk-overlay ${animateIn ? 'open' : ''}`} onMouseDown={onClose}>
      <div className="cmdk-panel" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="cmdk-input-row">
          <i className="fas fa-search" aria-hidden="true"></i>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, skills, roles, repos…"
            aria-label="Command palette search"
            aria-controls="cmdk-list"
            aria-activedescendant={results[activeIndex] ? `cmdk-${activeIndex}` : undefined}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="cmdk-list" role="listbox" id="cmdk-list" ref={listRef}>
          {results.length === 0 && (
            <div className="cmdk-empty">
              No matches for “{query}”.
              <span>Try a skill like “terraform” or a company name.</span>
            </div>
          )}
          {results.map((item, index) => {
            const showSection = !isSearching && item.section !== lastSection;
            lastSection = item.section;
            return (
              <React.Fragment key={`${item.section}-${item.id}`}>
                {showSection && <div className="cmdk-group-label">{item.section}</div>}
                <div
                  id={`cmdk-${index}`}
                  data-active={index === activeIndex}
                  className={`cmdk-item ${index === activeIndex ? 'active' : ''}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
                  onClick={() => runItem(item)}
                >
                  <span className="icon-tile"><i className={item.section === 'Recent' ? 'fas fa-clock-rotate-left' : item.icon}></i></span>
                  <span className="cmdk-item-label">
                    <Highlight text={item.label} indices={item.indices} />
                    {item.hint && <span className="cmdk-item-hint">{item.hint}</span>}
                  </span>
                  {isSearching && <span className="cmdk-item-type">{item.group}</span>}
                  {index === activeIndex && <i className="fas fa-arrow-turn-down cmdk-enter" aria-hidden="true"></i>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
          <span className="cmdk-footer-count">{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

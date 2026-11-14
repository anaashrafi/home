import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { showBlog, FirstName, LastName } from "../editable-stuff/configurations.json";
import { useTheme } from "../context/ThemeContext";

const PRIMARY = [
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
];

const MORE = [
  { to: "/leadership", label: "Leadership", icon: "fas fa-users-cog", desc: "Philosophy & impact" },
  { to: "/interests", label: "Interests", icon: "fas fa-compass", desc: "Life outside work" },
];

const useScrollProgress = () => {
  const [state, setState] = useState({ progress: 0, scrolled: false });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setState({
        progress: max > 0 ? Math.min(window.scrollY / max, 1) : 0,
        scrolled: window.scrollY > 12,
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return state;
};

const Navbar = ({ onOpenCommandPalette }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { progress, scrolled } = useScrollProgress();
  const { resolvedTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const moreRef = useRef(null);

  const more = showBlog ? [...MORE, { to: "/blog", label: "Blog", icon: "fas fa-pen-nib", desc: "Writing & notes" }] : MORE;
  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));
  const moreActive = more.some((m) => isActive(m.to));

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;
    const onDown = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setIsMoreOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setIsMoreOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMoreOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`} aria-label="Main navigation">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" aria-label={`${FirstName} ${LastName} — home`}>
            <img src="/logo_av_navbar.svg" alt="" />
            <span className="navbar-brand-title">
              {FirstName} {LastName}
              <span className="navbar-brand-sub">Cloud · Platform · DevSecOps</span>
            </span>
          </Link>

          <div className="navbar-links">
            {PRIMARY.map((item) => (
              <Link key={item.to} to={item.to} className={`navbar-link ${isActive(item.to) ? "active" : ""}`} aria-current={isActive(item.to) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <div className="navbar-more" ref={moreRef}>
              <button
                type="button"
                className={`navbar-link ${moreActive ? "active" : ""}`}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                onClick={() => setIsMoreOpen((v) => !v)}
              >
                More <i className={`fas fa-chevron-down navbar-more-chev ${isMoreOpen ? "open" : ""}`} aria-hidden="true"></i>
              </button>
              <div className={`navbar-more-menu ${isMoreOpen ? "open" : ""}`} role="menu">
                {more.map((item) => (
                  <Link key={item.to} to={item.to} role="menuitem" className={`navbar-more-item ${isActive(item.to) ? "active" : ""}`}>
                    <span className="icon-tile"><i className={item.icon} aria-hidden="true"></i></span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.desc}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="navbar-actions">
            <button type="button" className="cmdk-trigger" onClick={onOpenCommandPalette} aria-label="Search (Command K)">
              <i className="fas fa-search cmdk-trigger-icon" aria-hidden="true"></i>
              <span>Search</span>
              <kbd>&#8984;K</kbd>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            >
              <i className={resolvedTheme === "dark" ? "fas fa-sun" : "fas fa-moon"} aria-hidden="true"></i>
            </button>
            <Link to="/contact" className="btn btn-primary btn-sm navbar-cta">
              Let's talk
            </Link>
            <button
              type="button"
              className="navbar-menu-btn"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="hamburger"><span></span><span></span><span></span></span>
            </button>
          </div>
        </div>
        <div className="navbar-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true"></div>
      </nav>

      <div className={`navbar-mobile ${isMenuOpen ? "open" : ""}`} aria-hidden={!isMenuOpen}>
        {[{ to: "/", label: "Home" }, ...PRIMARY, ...more, { to: "/contact", label: "Contact" }].map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            tabIndex={isMenuOpen ? 0 : -1}
            className={`navbar-mobile-link ${isActive(item.to) ? "active" : ""}`}
            style={{ transitionDelay: isMenuOpen ? `${i * 35}ms` : "0ms" }}
          >
            <span><span className="navbar-mobile-index">0{i + 1}</span>{item.label}</span>
            <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;

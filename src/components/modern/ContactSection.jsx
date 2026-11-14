import React, { useEffect, useState } from 'react';
import Reveal from '../Reveal';
import { web3formsAccessKey } from '../../editable-stuff/configurations.json';
import { CONTACT_EMAIL, LINKS, LOCATION } from '../../data/profile';

const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 20;
const DRAFT_KEY = 'contact-draft';
const RESPONSE_TIME = 'I usually reply within 1–2 business days.';

const SUBJECTS = [
  { id: 'job', label: 'Job opportunity', icon: 'fas fa-briefcase' },
  { id: 'consulting', label: 'Consulting', icon: 'fas fa-compass-drafting' },
  { id: 'project', label: 'Collaboration', icon: 'fas fa-code-merge' },
  { id: 'speaking', label: 'Speaking', icon: 'fas fa-microphone' },
  { id: 'mentoring', label: 'Mentoring', icon: 'fas fa-seedling' },
  { id: 'other', label: 'Just saying hi', icon: 'fas fa-hand' },
];

const EMPTY = { name: '', email: '', subject: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (data) => {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Please tell me your name.';
  if (!data.email.trim()) errors.email = 'I need an email to reply to.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = "That email doesn't look quite right.";
  if (!data.subject) errors.subject = 'Pick what this is about.';
  if (data.message.trim().length < MIN_MESSAGE) errors.message = `A little more detail please (at least ${MIN_MESSAGE} characters).`;
  else if (data.message.length > MAX_MESSAGE) errors.message = `Please keep it under ${MAX_MESSAGE} characters.`;
  return errors;
};

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
};

const LocalTime = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <span>
      {now.toLocaleTimeString('en-AU', { timeZone: LOCATION.timeZone, hour: 'numeric', minute: '2-digit' })}
      {' '}in {LOCATION.city}
    </span>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState(loadDraft);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [toast, setToast] = useState(null);
  const [botcheck, setBotcheck] = useState(false);

  const errors = validate(formData);
  const showError = (field) => touched[field] && errors[field];

  // Autosave a draft so a refresh or accidental navigation doesn't lose the message.
  useEffect(() => {
    try {
      if (status === 'success') localStorage.removeItem(DRAFT_KEY);
      else localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {
      /* storage blocked — drafts are best-effort */
    }
  }, [formData, status]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const setField = (name, value) => setFormData((d) => ({ ...d, [name]: value }));
  const handleChange = (e) => setField(e.target.name, e.target.value);
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setToast('Email copied to clipboard');
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errors).length) {
      const first = ['name', 'email', 'subject', 'message'].find((f) => errors[f]);
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    if (botcheck) return;

    const subjectLabel = SUBJECTS.find((s) => s.id === formData.subject)?.label || formData.subject;
    setStatus('sending');

    try {
      if (!web3formsAccessKey) {
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Contact: ${subjectLabel}`)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
        )}`;
        setStatus('success');
        return;
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: formData.name,
          email: formData.email,
          subject: `Portfolio Contact: ${subjectLabel}`,
          message: formData.message,
          from_name: formData.name,
          replyto: formData.email,
          botcheck: false,
        }),
      });
      const result = await response.json();
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setFormData(EMPTY);
    setTouched({});
    setStatus('idle');
  };

  const messageLength = formData.message.length;

  return (
    <div className="container">
      <Reveal as="section" className="contact-layout">
        {/* Left: direct channels */}
        <aside className="contact-aside">
          <div className="card card-pad contact-email-card">
            <span className="contact-label">Fastest way</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">{CONTACT_EMAIL}</a>
            <div className="cluster" style={{ '--gap': '0.5rem', marginTop: 'var(--space-sm)' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={copyEmail}>
                <i className="fas fa-copy" aria-hidden="true"></i> Copy
              </button>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-ghost btn-sm">
                <i className="fas fa-envelope-open" aria-hidden="true"></i> Open mail app
              </a>
            </div>
          </div>

          <a href={LINKS.calendly} target="_blank" rel="noopener noreferrer" className="card card-hover card-pad contact-row">
            <span className="icon-tile"><i className="fas fa-calendar-check" aria-hidden="true"></i></span>
            <span><strong>Book a 30-min call</strong><small>Pick a slot on Calendly</small></span>
            <i className="fas fa-arrow-up-right-from-square contact-row-arrow" aria-hidden="true"></i>
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="card card-hover card-pad contact-row">
            <span className="icon-tile"><i className="fab fa-linkedin" aria-hidden="true"></i></span>
            <span><strong>LinkedIn</strong><small>Connect professionally</small></span>
            <i className="fas fa-arrow-up-right-from-square contact-row-arrow" aria-hidden="true"></i>
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="card card-hover card-pad contact-row">
            <span className="icon-tile"><i className="fab fa-github" aria-hidden="true"></i></span>
            <span><strong>GitHub</strong><small>See what I'm building</small></span>
            <i className="fas fa-arrow-up-right-from-square contact-row-arrow" aria-hidden="true"></i>
          </a>

          <div className="contact-meta">
            <p><i className="fas fa-clock" aria-hidden="true"></i> <LocalTime /></p>
            <p><i className="fas fa-reply" aria-hidden="true"></i> {RESPONSE_TIME}</p>
          </div>
        </aside>

        {/* Right: form */}
        <div className="card contact-form-card">
          {status === 'success' ? (
            <div className="contact-success" role="status">
              <span className="contact-success-icon"><i className="fas fa-check" aria-hidden="true"></i></span>
              <h2>Message sent.</h2>
              <p>Thanks{formData.name ? `, ${formData.name.split(' ')[0]}` : ''}! {RESPONSE_TIME}</p>
              <button type="button" className="btn btn-secondary" onClick={reset}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="stack" style={{ '--gap': 'var(--space-md)' }}>
              <div>
                <h2 className="contact-form-title">Send a message</h2>
                <p className="contact-form-sub">Your draft saves automatically while you type.</p>
              </div>

              {status === 'error' && (
                <div className="form-status error" role="alert">
                  <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                  Something went wrong sending that. Please email me directly at {CONTACT_EMAIL}.
                </div>
              )}

              <fieldset className="form-field contact-subjects">
                <legend className="form-label">What's this about?</legend>
                <div className="chip-group" id="contact-subject" tabIndex={-1}>
                  {SUBJECTS.map((s) => (
                    <label key={s.id} className={`chip ${formData.subject === s.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="subject"
                        value={s.id}
                        checked={formData.subject === s.id}
                        onChange={(e) => { handleChange(e); setTouched((t) => ({ ...t, subject: true })); }}
                      />
                      <i className={s.icon} aria-hidden="true"></i> {s.label}
                    </label>
                  ))}
                </div>
                {showError('subject') && <span className="form-error">{errors.subject}</span>}
              </fieldset>

              <div className="contact-form-row">
                <div className={`form-field ${showError('name') ? 'has-error' : ''}`}>
                  <label htmlFor="contact-name" className="form-label">Name</label>
                  <input
                    type="text" id="contact-name" name="name" className="form-input" autoComplete="name"
                    value={formData.name} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={!!showError('name')} aria-describedby="contact-name-err" placeholder="Jane Doe"
                  />
                  {showError('name') && <span id="contact-name-err" className="form-error">{errors.name}</span>}
                </div>
                <div className={`form-field ${showError('email') ? 'has-error' : ''}`}>
                  <label htmlFor="contact-email" className="form-label">Email</label>
                  <input
                    type="email" id="contact-email" name="email" className="form-input" autoComplete="email"
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={!!showError('email')} aria-describedby="contact-email-err" placeholder="jane@company.com"
                  />
                  {showError('email') && <span id="contact-email-err" className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className={`form-field ${showError('message') ? 'has-error' : ''}`}>
                <div className="spread">
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  <span className={`char-count ${messageLength > MAX_MESSAGE ? 'over' : messageLength > MAX_MESSAGE * 0.9 ? 'near' : ''}`}>
                    {messageLength}/{MAX_MESSAGE}
                  </span>
                </div>
                <textarea
                  id="contact-message" name="message" className="form-textarea"
                  value={formData.message} onChange={handleChange} onBlur={handleBlur}
                  aria-invalid={!!showError('message')} aria-describedby="contact-message-err"
                  placeholder="What are you working on, and how can I help?"
                ></textarea>
                {showError('message') && <span id="contact-message-err" className="form-error">{errors.message}</span>}
              </div>

              {/* Honeypot: hidden from people, tempting to bots */}
              <input type="checkbox" name="botcheck" className="sr-only" tabIndex={-1} autoComplete="off" checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} aria-hidden="true" />

              <button type="submit" className="btn btn-primary contact-submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <><span className="btn-spinner" aria-hidden="true" /> Sending…</>
                ) : (
                  <>Send message <i className="fas fa-paper-plane" aria-hidden="true"></i></>
                )}
              </button>
            </form>
          )}
        </div>
      </Reveal>

      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        <i className="fas fa-check-circle" aria-hidden="true"></i> {toast}
      </div>
    </div>
  );
};

export default ContactSection;

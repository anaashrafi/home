import React, { useState, useEffect, useMemo } from 'react';
import Reveal from '../Reveal';
import { gitHubUsername } from '../../editable-stuff/configurations.json';
import { fetchRepos, LANGUAGE_COLORS } from '../../hooks/useGitHub';

const CATEGORY_DEFS = [
  { id: 'cloud', title: 'Cloud & Infrastructure', match: (p) => p.topics?.some((t) => ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'terraform'].includes(t)) || /cloud|infrastructure/i.test(p.description || '') },
  { id: 'automation', title: 'DevOps & Automation', match: (p) => p.topics?.some((t) => ['devops', 'ci-cd', 'automation', 'jenkins', 'github-actions'].includes(t)) || /automation|devops/i.test(p.description || '') },
  { id: 'web', title: 'Web Applications', match: (p) => ['JavaScript', 'TypeScript', 'HTML'].includes(p.language) || p.topics?.some((t) => ['react', 'web', 'frontend'].includes(t)) },
  { id: 'tools', title: 'Tools & Utilities', match: (p) => ['Shell', 'Python'].includes(p.language) || p.topics?.some((t) => ['cli', 'tool', 'utility'].includes(t)) },
];

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const ProjectCard = ({ project }) => (
  <div className="card card-hover project-card">
    <div className="project-card-top">
      <h3>{project.name}</h3>
      <span className="cluster" style={{ '--gap': '0.6rem', fontSize: 'var(--fs-xs)', color: 'var(--color-text-tertiary)' }}>
        <span><i className="fas fa-star" aria-hidden="true"></i> {project.stargazers_count}</span>
        <span><i className="fas fa-code-branch" aria-hidden="true"></i> {project.forks_count}</span>
      </span>
    </div>
    <p className="project-desc">{project.description}</p>
    {project.topics?.length > 0 && (
      <div className="tag-list">
        {project.topics.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    )}
    <div className="project-meta-row">
      <span>
        <span className="project-lang-dot" style={{ background: LANGUAGE_COLORS[project.language] || 'var(--color-text-tertiary)' }}></span>
        {project.language || 'Mixed'}
      </span>
      <span>Updated {formatDate(project.updated_at)}</span>
    </div>
    <div className="project-actions">
      <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
        <i className="fab fa-github" aria-hidden="true"></i> Code
      </a>
      {project.homepage && (
        <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          <i className="fas fa-external-link-alt" aria-hidden="true"></i> Demo
        </a>
      )}
    </div>
  </div>
);

const TABS = [
  { id: 'featured', icon: 'fas fa-star', label: 'Featured' },
  { id: 'all', icon: 'fab fa-github', label: 'All Repos' },
  { id: 'categories', icon: 'fas fa-th-large', label: 'Categories' },
];

const PortfolioSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('featured');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updated');

  useEffect(() => {
    let cancelled = false;
    fetchRepos()
      .then((repos) => {
        if (cancelled) return;
        setProjects(
          repos.slice(0, 30).map((r) => ({
            id: r.id, name: r.name,
            description: r.description || `A ${r.language || 'software'} project by ${gitHubUsername}`,
            html_url: r.html_url, homepage: r.homepage, language: r.language,
            stargazers_count: r.stargazers_count, forks_count: r.forks_count,
            updated_at: r.pushed_at || r.updated_at, topics: r.topics || [],
          }))
        );
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const sorted = useMemo(() => {
    const list = [...projects];
    if (sort === 'stars') list.sort((a, b) => b.stargazers_count - a.stargazers_count);
    else list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return list;
  }, [projects, sort]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return sorted;
    return sorted.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.language?.toLowerCase().includes(q) ||
      p.topics?.some((t) => t.toLowerCase().includes(q))
    );
  }, [sorted, search]);

  const categories = useMemo(
    () => CATEGORY_DEFS.map((c) => ({ ...c, projects: projects.filter(c.match) })).filter((c) => c.projects.length > 0),
    [projects]
  );

  if (loading) {
    return <div className="container state-block"><i className="fas fa-spinner fa-spin"></i><p>Loading projects from GitHub&hellip;</p></div>;
  }

  if (error) {
    return (
      <div className="container state-block">
        <i className="fas fa-triangle-exclamation"></i>
        <p>Unable to load projects: {error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Reveal as="section" className="section" style={{ paddingTop: 0 }}>
        <div className="project-toolbar">
          <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }} role="tablist">
            {TABS.map((tab) => (
              <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <i className={tab.icon} aria-hidden="true"></i> {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'all' && (
            <div className="cluster">
              <div className="project-search">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="project-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="updated">Recently updated</option>
                <option value="stars">Most stars</option>
              </select>
            </div>
          )}
        </div>
        <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-lg)' }}></div>

        {activeTab === 'featured' && (
          <div className="grid grid-auto-lg">
            {sorted.slice(0, 6).map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="grid grid-auto-lg">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="stack" style={{ '--gap': 'var(--space-xl)' }}>
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 style={{ fontSize: 'var(--fs-md)', marginBottom: 'var(--space-sm)' }}>{cat.title}</h3>
                <div className="grid grid-auto-lg">
                  {cat.projects.slice(0, 4).map((p) => <ProjectCard key={p.id} project={p} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
};

export default PortfolioSection;

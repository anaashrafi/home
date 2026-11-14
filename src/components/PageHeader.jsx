import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const PageHeader = ({ title, subtitle, kicker }) => {
  useDocumentTitle(title, subtitle);

  return (
    <header className="page-header">
      <div className="container">
        {kicker && <span className="page-kicker">{kicker}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
};

export default PageHeader;

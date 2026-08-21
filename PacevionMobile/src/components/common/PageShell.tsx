import type { ReactNode } from 'react';
import './PageShell.css';

interface PageShellProps {
  children: ReactNode;
  title?: string;
}

export function PageShell({ children, title }: PageShellProps) {
  return (
    <div className="page-shell">
      {title && (
        <header className="page-shell-header">
          <h1>{title}</h1>
        </header>
      )}
      <div className="page-shell-content">
        {children}
      </div>
    </div>
  );
}

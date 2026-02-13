import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body style={{ backgroundColor: '#09090b', color: '#fafafa', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>404</h1>
          <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>Page not found</p>
          <a href="/en" style={{ color: '#f59e0b', textDecoration: 'underline' }}>
            Go to {siteConfig.name}
          </a>
        </div>
      </body>
    </html>
  );
}

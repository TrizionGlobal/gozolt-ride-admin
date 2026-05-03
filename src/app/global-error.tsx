'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            borderRadius: '8px',
            border: '1px solid #2A2A2A',
            backgroundColor: '#141414',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}
          >
            &#9888;
          </div>

          <h1
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
              margin: '0 0 8px 0',
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: 1.5,
            }}
          >
            A critical error occurred. Please reload the page to continue.
          </p>

          {error.digest && (
            <p
              style={{
                fontSize: '12px',
                color: '#6B7280',
                margin: '0 0 16px 0',
                fontFamily: 'monospace',
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000',
              backgroundColor: '#FACC15',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EAB308';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FACC15';
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

import type { ReactNode } from 'react';
import './[locale]/globals.css';

// Minimal root layout (next-intl pattern):
// - Localized routes under /[locale] render their own <html>/<body>.
// - Top-level routes like /auth/callback (OAuth fallback, excluded from
//   next-intl middleware) need a root layout to exist, so we just
//   pass children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

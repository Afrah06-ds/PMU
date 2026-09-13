import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/shell/AppShell';

export const metadata: Metadata = {
  title: 'Tracker Pro — Personal Technical Learning Management System',
  description: 'Manage curricula, track learning state & confidence, auto-schedule revisions, and analyze technical learning progress.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

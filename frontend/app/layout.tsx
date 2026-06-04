import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import I18nProvider from '@/components/I18nProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PrajapatiParivar.in - Connecting Our Community',
  description: 'The official digital directory, news, and events platform for the Prajapati community. Reconnect with families, find verified contacts, and celebrate our shared heritage.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <I18nProvider>
          {/* Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          
          {/* Global Footer */}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}

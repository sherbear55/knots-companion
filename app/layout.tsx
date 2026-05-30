import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Knots of Survival: Caregiver Companion',
  description: 'A daily reflection companion for caregivers — grounded in 17 knots of wisdom, one question at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#FAF7F2', color: '#2C2C2C' }}>
        {children}
      </body>
    </html>
  );
}

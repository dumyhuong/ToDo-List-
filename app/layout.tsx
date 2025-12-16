// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './src/utils/ThemeContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js ToDo (TSX & Theme)',
  description: 'A modern ToDo List built with Next.js and TypeScript.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Body mặc định KHÔNG chứa class theme
    <html lang="en">
      <body className={inter.className}>
        {/* Bọc toàn bộ ứng dụng bằng ThemeProvider */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
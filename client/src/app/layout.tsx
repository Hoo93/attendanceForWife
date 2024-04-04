import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import theme from '@/theme';

// Provider
import QueryClientProviders from './provider';
import { ThemeProvider } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '체쿠리',
    description: '출석부 서비스',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <QueryClientProviders>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </QueryClientProviders>
            </body>
        </html>
    );
}

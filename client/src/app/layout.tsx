import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
// Provider
import QueryClientProviders from './provider';
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

const notoSans = Noto_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CHECKUREE',
    description: '출석부 서비스',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>CHECKUREE</title>
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined&display=block"
                    rel="stylesheet"
                />
            </head>
            <body className={notoSans.className}>
                <QueryClientProviders>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </QueryClientProviders>
            </body>
        </html>
    );
}

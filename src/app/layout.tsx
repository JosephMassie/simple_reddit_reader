import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Link from 'next/link';

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: 'SRR',
    description: 'A simple Reddit reader',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}

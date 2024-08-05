import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RSS Reader',
    description: 'A simple Reddit RSS Reader',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main
                    role="main"
                    className="min-h-screen bg-slate-800 m-0 text-white"
                >
                    <div
                        className="container pt-10 mx-auto grid gap-x-[10px]"
                        style={{ gridTemplateColumns: '20% 80%' }}
                    >
                        <div className="flex flex-col">
                            <Link href="/">Feed</Link>
                            <Link href="/feed_manager">Manage</Link>
                        </div>
                        <div>{children}</div>
                    </div>
                </main>
            </body>
        </html>
    )
}

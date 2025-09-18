import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/(root)/Footer'
import { AuthProvider } from '@/lib/auth'

const text = Inter({
    variable: '--font-text',
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'DRIFT Coffee - Quản lí quán cafe',
    description: 'Website quản lí quán cafe',
    icons: '/logo.jpg',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${text.variable} flex min-h-svh w-svw flex-col justify-between bg-[image:var(--background)] antialiased`}
            >
                <div className="flex-1">
                    <AuthProvider>{children}</AuthProvider>
                </div>
                <Footer />
            </body>
        </html>
    )
}

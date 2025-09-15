'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { JSX } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

type Feature = {
    id: 'order' | 'menu' | 'revenue'
    title: string
    description: string
    icon: JSX.Element
    href: string
}

function IconReceipt() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
            <path
                d="M7 3h10a2 2 0 0 1 2 2v14l-3-1-3 1-3-1-3 1V5a2 2 0 0 1 2-2Zm2 4h6M9 9h6M9 13h6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}
function IconCoffee() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
            <path
                d="M4 8h12a4 4 0 1 0 0 8H8a4 4 0 0 1-4-4V8Zm12 0v8M7 4s0 2 2 2 2 2 2 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}
function IconChart() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
            <path
                d="M4 19V5M20 19H4M8 15v-4M12 19v-8M16 13V8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default function Home(): JSX.Element {
    const router = useRouter()

    const handleLogout = () => {
        // Xóa API key khỏi localStorage
        localStorage.removeItem('apiKey')
        localStorage.removeItem('apiKeyExpires')

        // Redirect về login
        router.replace('/login')
    }

    const features: Feature[] = [
        {
            id: 'order',
            title: 'Đặt hàng',
            description: 'Tạo đơn hàng mới, quản lý order của khách và theo dõi trạng thái',
            icon: <IconReceipt />,
            href: '/order',
        },
        {
            id: 'menu',
            title: 'Danh sách đồ uống',
            description: 'Xem và chỉnh sửa menu, cập nhật giá và thông tin sản phẩm',
            icon: <IconCoffee />,
            href: '/menu',
        },
        {
            id: 'revenue',
            title: 'Doanh thu',
            description: 'Theo dõi doanh số theo ngày, tuần, tháng và báo cáo',
            icon: <IconChart />,
            href: '/revenue',
        },
    ]

    return (
        <AuthGuard>
            <div
                id="home"
                className="flex h-full w-full flex-col items-center justify-center px-10 py-8 select-none sm:px-12 lg:flex-row lg:justify-around"
            >
                {/* Logo section */}
                <div className="flex w-full flex-col items-center justify-center gap-6 pt-10 lg:flex-1 lg:gap-8">
                    <div className="relative">
                        <Image
                            src="/logo.jpg"
                            alt="DRIFT Coffee Logo"
                            width={120}
                            height={120}
                            className="h-20 w-20 rounded-xl object-cover shadow-lg transition-transform duration-300 hover:scale-105 sm:h-24 sm:w-24 sm:rounded-2xl lg:h-[120px] lg:w-[120px] lg:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                            priority
                        />
                    </div>
                    <div className="flex-1 space-y-2 text-center lg:space-y-3">
                        <h1 className="from-foreground to-foreground/80 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-[-0.02em] text-transparent sm:text-4xl lg:text-5xl">
                            DRIFT Coffee
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base lg:text-[1.1rem]">
                            If you can dream it, you can do it {'>..<'}
                        </p>
                    </div>
                </div>

                {/* Features section */}
                <div className="mt-8 flex flex-1 flex-col items-center justify-center lg:mt-0 lg:items-start">
                    <div className="flex w-full max-w-md flex-col gap-6 sm:max-w-lg lg:max-w-[500px] lg:gap-6">
                        {features.map((feature) => (
                            <Link
                                key={feature.id}
                                href={feature.href}
                                className="group bg-card hover:bg-card/80 relative flex min-h-[100px] w-full flex-col items-start gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 sm:h-32 sm:flex-row sm:items-center sm:gap-4 sm:rounded-2xl sm:p-6 lg:gap-6 lg:p-8"
                            >
                                <div className="flex flex-row items-center justify-start gap-6">
                                    <span className="bg-card text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-xl lg:h-14 lg:w-14">
                                        {feature.icon}
                                        <span className="sr-only">{feature.title}</span>
                                    </span>
                                    <span className="block text-lg font-semibold tracking-[-0.01em] sm:hidden sm:text-xl lg:text-[1.35rem]">
                                        {feature.title}
                                    </span>
                                </div>
                                <span className="flex-1 space-y-1">
                                    <span className="hidden text-lg font-semibold tracking-[-0.01em] sm:block sm:text-xl lg:text-[1.35rem]">
                                        {feature.title}
                                    </span>
                                    <span className="text-muted-foreground block text-xs leading-relaxed sm:text-sm">
                                        {feature.description}
                                    </span>
                                </span>
                                {/* subtle highlight */}
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    style={{
                                        background:
                                            'linear-gradient(45deg, color-mix(in oklab, white 10%, transparent), transparent)',
                                    }}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                {/* Logout button */}
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="bg-card hover:bg-card/80 relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-xl border p-5 text-left text-wrap transition-all duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:gap-4 sm:rounded-2xl"
                    >
                        Logout
                        <LogOut />
                    </Button>
                </div>
            </div>
        </AuthGuard>
    )
}

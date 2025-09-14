import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/(dashboard)/Header'
import { Hamburger, Utensils } from 'lucide-react'

type orderMethodsType = {
    label: string
    href: string
    logo: React.ReactNode
    description: string
}

const orderMethods: orderMethodsType[] = [
    {
        label: 'Dùng tại quán',
        href: '/order/eat-in',
        logo: <Utensils />,
        description: 'Chọn bàn và order',
    },
    {
        label: 'Mang về',
        href: '/order/take-away',
        logo: <Hamburger />,
        description: 'Tạo đơn mang về nhanh',
    },
]

export default function Order() {
    return (
        <div className="bg-background w-full">
            <Header title="ĐẶT HÀNG" />
            <div className="container mx-auto max-w-6xl px-10 py-16 sm:px-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {orderMethods.map((method) => (
                        <Link key={method.label} href={method.href}>
                            <Card className="group bg-card h-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                {/* Logo */}
                                <div className="flex items-center justify-center p-8 sm:p-12">
                                    <div className="text-foreground transition-transform duration-300 group-hover:scale-110 [&_svg]:h-16 [&_svg]:w-16 sm:[&_svg]:h-20 sm:[&_svg]:w-20 lg:[&_svg]:h-24 lg:[&_svg]:w-24">
                                        {method.logo}
                                    </div>
                                </div>

                                <CardHeader className="pb-4">
                                    <CardTitle className="text-foreground text-center text-xl font-semibold sm:text-2xl lg:text-3xl">
                                        {method.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-8 text-center">
                                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                                        {method.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

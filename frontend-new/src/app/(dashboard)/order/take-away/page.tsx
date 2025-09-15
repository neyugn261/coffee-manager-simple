'use client'

import { useEffect, useCallback } from 'react'
import { useOrders } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/(dashboard)/Header'
import { BrushCleaning, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TakeAwayListPage() {
    const { state, actions } = useOrders()
    const { orders } = state
    const { createOrder } = actions
    const router = useRouter()

    // Lọc các đơn mang về chưa hoàn thành (status !== 'paid')
    const takeAwayOrders = orders.filter((o) => o.type === 'take-away' && o.status !== 'paid')

    // Redirect đến trang tạo đơn mới
    const handleCreate = () => {
        // Tạo một ID tạm thời cho đơn hàng mới
        const tempId = `temp-${Date.now()}`
        router.push(`/order/take-away/${tempId}`)
    }

    const fetchOrdersCallback = useCallback(() => {
        actions.fetchOrders()
    }, [actions.fetchOrders])

    useEffect(() => {
        // Fetch lại đơn hàng khi vào trang
        fetchOrdersCallback()
    }, [fetchOrdersCallback])

    return (
        <div className="bg-background">
            <Header backLink="/order" title="Đơn mang về" />
            <div className="mx-auto max-w-4xl p-4">
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-4 text-lg select-none sm:text-xl">
                            <Plus />
                            Tạo đơn mang về mới
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="btn-management w-full" onClick={handleCreate}>
                            + Tạo đơn mới
                        </Button>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {takeAwayOrders.length === 0 ? (
                        <div className="text-muted-foreground col-span-2 flex flex-col items-center justify-center py-16 text-center select-none">
                            <BrushCleaning className="my-6" />
                            <div className="mb-2 text-lg font-medium">Chưa có đơn mang về nào</div>
                            <div className="text-sm">Nhấn &quot;Tạo đơn mới&quot; để bắt đầu</div>
                        </div>
                    ) : (
                        takeAwayOrders.map((order) => (
                            <Link key={order.id} href={`/order/take-away/${order.id}`}>
                                <Card className="cursor-pointer transition-all hover:shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                            Đơn #{order.id}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground text-sm">
                                            {order.lines.length} món | Tổng:{' '}
                                            {order.lines
                                                .reduce((s, l) => s + l.qty * l.item.price, 0)
                                                .toLocaleString()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/store'
import { updateOrderStatusOnApi } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

export default function CartDrawer({ orderId }: { orderId: string }) {
    const { state, actions } = useOrders()
    const { orders } = state
    const { updateOrderStatus } = actions

    const order = orders.find((o) => o.id === orderId)
    if (!order) return null

    const total = order.lines.reduce((s, l) => s + l.qty * l.item.price, 0)
    const itemCount = order.lines.reduce((s, l) => s + l.qty, 0)

    const handleStatusUpdate = async (status: OrderStatus) => {
        await updateOrderStatus(orderId, status)

        // Also update via API if there's a serverId
        if (order.serverId) {
            const apiStatus =
                status === 'serving' ? 'preparing' : status === 'paid' ? 'completed' : 'pending'
            await updateOrderStatusOnApi(order.serverId, apiStatus)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-xl px-6 py-3 font-medium shadow-lg transition-all hover:shadow-xl sm:flex-none"
                >
                    🛒 Giỏ hàng ({itemCount})
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-card text-foreground border-border">
                <SheetHeader className="bg-card">
                    <SheetTitle className="text-foreground">Đơn #{order.id}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                    {order.lines.map((l) => (
                        <div
                            key={l.item.id}
                            className="bg-secondary/50 flex justify-between rounded-lg p-3 text-sm"
                        >
                            <span className="text-foreground">
                                {l.item.name} × {l.qty}
                            </span>
                            <span className="text-accent font-medium">
                                {(l.qty * l.item.price).toLocaleString()}đ
                            </span>
                        </div>
                    ))}
                </div>
                <div className="bg-primary/10 border-primary mt-4 flex items-center justify-between rounded-lg border-t-2 p-4">
                    <div className="text-muted-foreground text-sm">Tổng cộng</div>
                    <div className="text-primary text-lg font-bold">{total.toLocaleString()}đ</div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    <Button
                        className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={() => handleStatusUpdate('pending')}
                    >
                        🕒 Chưa phục vụ
                    </Button>
                    <Button
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => handleStatusUpdate('serving')}
                    >
                        🍽️ Đang phục vụ
                    </Button>
                    <Button
                        className="w-full bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleStatusUpdate('paid')}
                    >
                        ✅ Đã thanh toán
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

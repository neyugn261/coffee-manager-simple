'use client'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import apiService from '@/services/apiService'
import { updateOrderStatusOnApi } from '@/lib/utils'
import type { OrderStatus, Order } from '@/lib/types'

export default function CartDrawer({ orderId }: { orderId: string }) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true)
                const orders = await apiService.order.getAll()
                const foundOrder = orders.find((o) => o.id === parseInt(orderId))
                setOrder(foundOrder || null)
            } catch (error) {
                console.error('Error fetching order:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId])

    if (!order) return null

    // Calculate total and item count from order items
    const total = order.total || 0
    const itemCount = order.items.reduce((s, item) => s + item.quantity, 0)

    const handleStatusUpdate = async (status: OrderStatus) => {
        try {
            setLoading(true)
            // Update order status via API
            if (status === 'paid') {
                const updatedOrder = await apiService.order.updatePayment(parseInt(orderId), 'paid')
                setOrder(updatedOrder)
            }

            // Also update via API if there's a serverId
            if (order.serverId) {
                const apiStatus =
                    status === 'serving' ? 'preparing' : status === 'paid' ? 'completed' : 'pending'
                await updateOrderStatusOnApi(order.serverId, apiStatus)
            }
        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setLoading(false)
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
                    {order.items.map((item, index) => (
                        <div
                            key={`${item.menu_item_id}-${index}`}
                            className="bg-secondary/50 flex justify-between rounded-lg p-3 text-sm"
                        >
                            <span className="text-foreground">
                                Item #{item.menu_item_id} × {item.quantity}
                            </span>
                            <span className="text-accent font-medium">{item.quantity} items</span>
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

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/(dashboard)/Header'
import CartDrawer from '@/components/(dashboard)/order/CartDrawer'
import MenuCard from '@/components/(dashboard)/order/MenuCard'
import SearchFilter from '@/components/(dashboard)/order/SearchFilter'
import { useMenu, useOrders } from '@/store'
import type { Category, MenuItem } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function TakeAwayOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { state: menuState, actions: menuActions } = useMenu()
    const { state: orderState, actions: orderActions } = useOrders()
    const { items: menu } = menuState
    const { orders } = orderState
    const { fetchItems } = menuActions
    const { createOrder, addLine } = orderActions

    const orderId = params.order_id as string
    const [isNewOrder, setIsNewOrder] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<Category>('all')

    // Load menu on component mount
    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    useEffect(() => {
        if (orderId.startsWith('temp-')) {
            // Đây là đơn hàng mới chưa được tạo
            setIsNewOrder(true)
        } else {
            // Tìm đơn hàng theo ID
            const foundOrder = orders.find((o) => o.id === orderId)
            if (!foundOrder) {
                // Không tìm thấy đơn hàng, redirect về danh sách
                router.push('/order/take-away')
            }
            setIsNewOrder(false)
        }
    }, [orderId, orders, router])

    const filtered = useMemo(
        () =>
            menu.filter(
                (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) &&
                    (category === 'all' || i.category === category),
            ),
        [menu, search, category],
    )

    const handleAddLine = async (item: MenuItem) => {
        if (!orderId) return
        console.log('➕ Adding item to order:', item.name)

        try {
            // Check if this is the first item
            const currentOrder = orders.find((o) => o.id === orderId)
            if (!currentOrder || !currentOrder.lines || currentOrder.lines.length === 0) {
                console.log('🍽️ Creating new order with first item')
                await createOrder({
                    type: 'take-away',
                    lines: [{ item, qty: 1 }],
                    notes: '',
                })

                // Sau khi tạo đơn hàng thành công, cập nhật orderId
                // Tìm đơn hàng mới nhất vừa tạo
                setTimeout(() => {
                    const newOrders = orders.filter(
                        (o) => o.type === 'take-away' && o.status !== 'paid',
                    )
                    const latestOrder = newOrders.sort((a, b) => Number(b.id) - Number(a.id))[0]
                    if (latestOrder) {
                        console.log('🔄 Updating orderId to:', latestOrder.id)
                        // Cập nhật URL để reflect đơn hàng thật
                        router.replace(`/order/take-away/${latestOrder.id}`)
                    }
                }, 100)
            } else {
                // Add to existing order
                console.log('➕ Adding to existing order')
                const orderLine = {
                    item: item,
                    qty: 1,
                }
                await addLine(orderId, orderLine)
            }
        } catch (error) {
            console.error('❌ Failed to add item:', error)
        }
    }

    const handleSaveOrder = async () => {
        if (!orderId) return
        const order = orders.find((o) => o.id === orderId)
        if (!order) return

        // Kiểm tra đơn hàng có món không
        if (!order.lines || order.lines.length === 0) {
            alert('Đơn hàng phải có ít nhất 1 món để lưu')
            return
        }

        try {
            // Chỉ lưu nếu đây là đơn hàng temp (chưa có ID thật từ database)
            if (isNewOrder) {
                console.log('💾 Saving new order to database:', order)
                console.log('📋 Order lines:', order.lines)
                console.log('📝 Order notes:', order.notes)

                // Sử dụng createOrder để lưu đơn hàng vào database
                const result = await createOrder({
                    type: 'take-away',
                    lines: order.lines,
                    notes: order.notes || '',
                })

                console.log('✅ New order saved successfully:', result)
            } else {
                console.log('✅ Order already exists in database, no need to save')
            }

            // Redirect về danh sách đơn hàng
            router.push('/order/take-away')
        } catch (error) {
            console.error('❌ Failed to save order:', error)
            console.error('❌ Error details:', error)
            alert('Có lỗi xảy ra khi lưu đơn hàng: ' + (error as Error).message)
        }
    }

    if (!orderId) return null

    return (
        <div>
            <Header
                backLink="/order/take-away"
                title={isNewOrder ? 'Tạo đơn mang về mới' : `Đơn #${orderId}`}
            />
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <SearchFilter
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                    />
                    <div className="flex flex-row gap-2">
                        <Button
                            variant="secondary"
                            className="bg-secondary border-border text-foreground rounded-md border px-4 py-2"
                            onClick={handleSaveOrder}
                        >
                            Lưu đơn
                        </Button>
                        <CartDrawer orderId={orderId} />
                    </div>
                </div>
            </div>
            <div className="mx-auto flex max-w-7xl flex-row flex-wrap gap-6">
                {filtered.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={handleAddLine} />
                ))}
            </div>
            <div className="mx-auto max-w-7xl p-5"></div>
        </div>
    )
}

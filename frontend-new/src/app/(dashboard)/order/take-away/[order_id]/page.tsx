'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/(dashboard)/Header'
import CartDrawer from '@/components/(dashboard)/order/CartDrawer'
import MenuCard from '@/components/(dashboard)/order/MenuCard'
import SearchFilter from '@/components/(dashboard)/order/SearchFilter'
import apiService from '@/services/apiService'
import type { Category, MenuItem, Order, OrderLine } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function TakeAwayOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params.order_id as string

    const [menu, setMenu] = useState<MenuItem[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [isNewOrder, setIsNewOrder] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<Category>('all')
    const [loading, setLoading] = useState(false)

    // Load menu and orders on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [menuData, ordersData] = await Promise.all([
                    apiService.menu.getAll(),
                    apiService.order.getAll(),
                ])
                setMenu(menuData)
                setOrders(ordersData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (orderId.startsWith('temp-')) {
            // Đây là đơn hàng mới chưa được tạo
            setIsNewOrder(true)
        } else {
            // Tìm đơn hàng theo ID
            const orderIdNum = parseInt(orderId)
            const foundOrder = orders.find((o) => o.id === orderIdNum)
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
            const orderIdNum = parseInt(orderId)
            const currentOrder = orders.find((o) => o.id === orderIdNum)
            if (!currentOrder || !currentOrder.items || currentOrder.items.length === 0) {
                console.log('🍽️ Creating new order with first item')
                const newOrder = await apiService.order.createTakeaway({
                    items: [{ menu_item_id: item.id, quantity: 1 }],
                    notes: '',
                })

                // Update orders list
                setOrders((prev) => [...prev, newOrder])

                // Update URL to reflect real order ID
                router.replace(`/order/take-away/${newOrder.id}`)
            } else {
                // For existing orders, we would need to implement add line functionality
                // For now, we'll create a new order with additional items
                console.log('➕ Adding to existing order - creating new order with all items')
                const allItems = [...currentOrder.items]
                allItems.push({ menu_item_id: item.id, quantity: 1 })

                const updatedOrder = await apiService.order.createTakeaway({
                    items: allItems,
                    notes: currentOrder.notes || '',
                })

                // Remove old order and add new one
                setOrders((prev) => prev.filter((o) => o.id !== orderIdNum).concat(updatedOrder))
                router.replace(`/order/take-away/${updatedOrder.id}`)
            }
        } catch (error) {
            console.error('❌ Failed to add item:', error)
        }
    }

    const handleSaveOrder = async () => {
        if (!orderId) return
        const orderIdNum = parseInt(orderId)
        const order = orders.find((o) => o.id === orderIdNum)
        if (!order) return

        // Kiểm tra đơn hàng có món không
        if (!order.items || order.items.length === 0) {
            alert('Đơn hàng phải có ít nhất 1 món để lưu')
            return
        }

        try {
            // Chỉ lưu nếu đây là đơn hàng temp (chưa có ID thật từ database)
            if (isNewOrder) {
                console.log('💾 Saving new order to database:', order)
                console.log('📋 Order items:', order.items)
                console.log('📝 Order notes:', order.notes)

                const result = await apiService.order.createTakeaway({
                    items: order.items,
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

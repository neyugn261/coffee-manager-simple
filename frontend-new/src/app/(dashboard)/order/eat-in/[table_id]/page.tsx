'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/(dashboard)/Header'
import CartDrawer from '@/components/(dashboard)/order/CartDrawer'
import MenuCard from '@/components/(dashboard)/order/MenuCard'
import SearchFilter from '@/components/(dashboard)/order/SearchFilter'
import apiService from '@/services/apiService'
import { saveOrderToApi } from '@/lib/utils'
import type { Category, MenuItem, Order } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function TableDetailPage() {
    const { table_id } = useParams<{ table_id: string }>()

    const [menu, setMenu] = useState<MenuItem[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [orderId, setOrderId] = useState<string | null>(null)
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

    // Create eat-in order for this table
    useEffect(() => {
        if (!table_id || orderId) return

        const createEatInOrder = async () => {
            console.log('🍽️ Table ID ready:', table_id)
            // Don't create empty order - will create when user adds first item
            const tempId = 'temp-' + table_id + '-' + Date.now()
            console.log('✅ Ready to take orders for table with temp ID:', tempId)
            setOrderId(tempId)
        }
        createEatInOrder()
    }, [table_id, orderId])

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
            if (!currentOrder || !currentOrder.items || currentOrder.items.length === 0) {
                console.log('🍽️ Creating new order with first item')
                const newOrder = await apiService.order.createForTable(table_id, {
                    items: [{ menu_item_id: item.id, quantity: 1 }],
                    notes: '',
                })

                // Update orders list
                setOrders((prev) => [...prev, newOrder])

                // Update orderId to real order ID
                setOrderId(newOrder.id)
            } else {
                // For existing orders, we would need to implement add line functionality
                // For now, we'll create a new order with additional items
                console.log('➕ Adding to existing order - creating new order with all items')
                const allItems = [...currentOrder.items]
                allItems.push({ menu_item_id: item.id, quantity: 1 })

                const updatedOrder = await apiService.order.createForTable(table_id, {
                    items: allItems,
                    notes: currentOrder.notes || '',
                })

                // Remove old order and add new one
                setOrders((prev) => prev.filter((o) => o.id !== orderId).concat(updatedOrder))
                setOrderId(updatedOrder.id)
            }
        } catch (error) {
            console.error('❌ Failed to add item:', error)
        }
    }

    const handleSaveOrder = async () => {
        if (!orderId) return
        const order = orders.find((o) => o.id === orderId)
        if (!order) return

        try {
            const saved = await saveOrderToApi(order)
            if (saved?.id) {
                console.log('✅ Order saved successfully:', saved)
            }
        } catch (error) {
            console.error('Failed to save order:', error)
        }
    }

    if (!orderId) return null

    return (
        <div>
            <Header backLink="/order" title={`Bàn ${table_id}`} />
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

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/(dashboard)/Header'
import CartDrawer from '@/components/(dashboard)/order/CartDrawer'
import MenuCard from '@/components/(dashboard)/order/MenuCard'
import SearchFilter from '@/components/(dashboard)/order/SearchFilter'
import apiService from '@/services/apiService'
import type { Category, MenuItem, Order } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TableDetailPage() {
    const { table_id } = useParams<{ table_id: string }>()

    const [menu, setMenu] = useState<MenuItem[]>([])
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<Category>('all')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load menu and orders on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                const [menuData, ordersData] = await Promise.all([
                    apiService.menu.getAll(),
                    apiService.order.getAll(),
                ])
                setMenu(menuData)

                // Check if there's an existing unpaid order for this table
                const existingOrder = ordersData.find(
                    (o) => o.table_id === parseInt(table_id) && o.payment_status === 'unpaid',
                )
                if (existingOrder) {
                    setCurrentOrder(existingOrder)
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch data')
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [table_id])

    const filtered = useMemo(
        () =>
            menu.filter(
                (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) &&
                    (category === 'all' || i.category === category),
            ),
        [menu, search, category],
    )

    const handleAddItem = async (item: MenuItem, quantity: number = 1) => {
        console.log('➕ Adding item to order:', item.name, 'quantity:', quantity)

        try {
            if (!currentOrder) {
                // Create new order
                console.log('🍽️ Creating new order with first item')
                const newOrder = await apiService.order.createForTable(parseInt(table_id), {
                    items: [{ menu_item_id: item.id, quantity }],
                    notes: '',
                })

                setCurrentOrder(newOrder)
            } else {
                // Add to existing order
                console.log('➕ Adding to existing order')
                const existingItemIndex = currentOrder.items.findIndex(
                    (orderItem) => orderItem.menu_item_id === item.id,
                )

                let updatedItems
                if (existingItemIndex >= 0) {
                    // Update quantity of existing item
                    updatedItems = [...currentOrder.items]
                    updatedItems[existingItemIndex].quantity += quantity
                } else {
                    // Add new item
                    updatedItems = [...currentOrder.items, { menu_item_id: item.id, quantity }]
                }

                const updatedOrder = await apiService.order.createForTable(parseInt(table_id), {
                    items: updatedItems,
                    notes: currentOrder.notes || '',
                })

                // Update current order
                setCurrentOrder(updatedOrder)
            }
        } catch (error) {
            console.error('❌ Failed to add item:', error)
            setError('Failed to add item to order')
        }
    }

    if (loading && menu.length === 0) {
        return (
            <div className="flex h-screen flex-col">
                <Header backLink="/order/eat-in" title={`Bàn ${table_id}`} />
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="flex items-center gap-2">
                        <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                        <span className="text-muted-foreground text-sm">Đang tải thực đơn...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col">
            <Header backLink="/order/eat-in" title={`Bàn ${table_id}`} />

            {error && (
                <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 max-w-md">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg">
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                                <span className="text-sm font-medium text-red-600">!</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-red-800">Có lỗi xảy ra</p>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="flex-shrink-0 text-red-400 transition-colors hover:text-red-600"
                            >
                                <span className="sr-only">Đóng</span>
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Status Header */}
            {currentOrder && (
                <div className="bg-card/50 flex-shrink-0 border-b py-4 select-none">
                    <div className="mx-auto max-w-6xl px-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-sm">
                                    <span className="text-foreground">Đơn hàng hiện tại</span>
                                    <span className="text-primary font-semibold">
                                        Đơn #{currentOrder.id}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {currentOrder.items.length} món | Tổng:{' '}
                                        {currentOrder.total.toLocaleString()}đ
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-background text-foreground border-border hover:bg-accent"
                                        >
                                            Xem chi tiết
                                        </Button>
                                        {currentOrder && (
                                            <CartDrawer orderId={currentOrder.id.toString()} />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-card/30 flex-shrink-0 border-b py-4">
                <div className="mx-auto max-w-6xl px-6">
                    <SearchFilter
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                    />
                </div>
            </div>

            {/* Menu Grid */}
            <div className="scrollable-area flex-1 overflow-y-auto">
                <div className="mx-auto max-w-6xl p-6">
                    {filtered.length === 0 ? (
                        <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 text-6xl">🍽️</div>
                            <div className="mb-2 text-lg font-medium">Không tìm thấy món nào</div>
                            <div className="text-sm">
                                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((item) => (
                                <MenuCard
                                    key={item.id}
                                    item={item}
                                    onAdd={(menuItem, qty) => handleAddItem(menuItem, qty || 1)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

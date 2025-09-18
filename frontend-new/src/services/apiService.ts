import { api } from './api'

/**
 * ===============================================
 * CAFE MANAGER API SERVICE
 * ===============================================
 * API service layer cho frontend - Cập nhật theo backend mới
 * Chú thích rõ ràng cho từng API endpoint
 * ===============================================
 */

// Types for API service (reusing from api.ts)
interface MenuItem {
    id: number
    name: string
    price: number
    category:
        | 'yaourt'
        | 'milkTea'
        | 'soda'
        | 'fruitTea'
        | 'topping'
        | 'latte'
        | 'food'
        | 'coffee'
        | 'milo-cacao'
        | 'juice'
        | 'bottleDrink'
        | 'other'
    image_url?: string
    created_at?: string
    updated_at?: string
}

interface Table {
    id: number
    table_name: string
    status: 'empty' | 'occupied'
    role: 'HOST' | 'CHILD' | 'NORMAL'
    is_merged: boolean
    host_id?: number | null
    merged_tables?: number[] | null
    created_at: string
    updated_at: string
}

interface OrderItem {
    menu_item_id: number
    quantity: number
}

interface Order {
    id: number
    table_id?: number
    customer_name?: string | null
    order_type: 'takeaway' | 'dine_in'
    payment_status: 'unpaid' | 'paid'
    total: number
    notes?: string | null
    created_at: string
    paid_at?: string | null
    items: OrderItem[]
}

interface CreateMenuItemData {
    name: string
    price: number
    category?:
        | 'yaourt'
        | 'milkTea'
        | 'soda'
        | 'fruitTea'
        | 'topping'
        | 'latte'
        | 'food'
        | 'coffee'
        | 'milo-cacao'
        | 'juice'
        | 'bottleDrink'
        | 'other'
    image_url?: string
}

interface CreateTableData {
    name?: string
    table_name?: string
}

interface CreateOrderData {
    items: OrderItem[]
    customer_name?: string
    notes?: string
}

const apiService = {
    /**
     * ===============================================
     * MENU APIs - Quản lý thực đơn
     * ===============================================
     * Base URL: /api/menu
     */
    menu: {
        // GET /api/menu - Lấy tất cả menu items
        getAll: async (): Promise<MenuItem[]> => {
            try {
                console.log('🍽️ Fetching menu items...')
                const response = await api.menu.getAll()
                console.log('🍽️ Menu response:', response)
                return response.data || [] // Backend trả về {status, data, count}
            } catch (error) {
                console.error('🍽️ Menu getAll failed:', error)
                // Nếu là lỗi authentication, không cần throw lại vì api.ts đã handle
                if (error instanceof Error && error.message && error.message.includes('401')) {
                    return [] // Return empty array để tránh crash UI
                }
                throw error
            }
        },

        // GET /api/menu/:id - Lấy menu item theo ID
        getById: async (id: number): Promise<MenuItem> => {
            const response = await api.menu.getById(id)
            return response.data
        },

        // POST /api/menu - Tạo menu item mới
        // body: { name, price, category, image_url }
        create: async (data: CreateMenuItemData): Promise<MenuItem> => {
            const response = await api.menu.create(data)
            return response.data
        },

        // PATCH /api/menu/:id - Cập nhật menu item
        update: async (id: number, data: Partial<CreateMenuItemData>): Promise<MenuItem> => {
            const response = await api.menu.update(id, data)
            return response.data
        },

        // DELETE /api/menu/:id - Xóa menu item
        delete: async (id: number): Promise<void> => {
            await api.menu.delete(id)
        },
    },

    /**
     * ===============================================
     * TABLES APIs - Quản lý bàn ăn (Core feature)
     * ===============================================
     * Base URL: /api/tables
     */
    table: {
        // GET /api/tables - Lấy tất cả bàn (dùng cho grid Tables)
        getAll: async (): Promise<Table[]> => {
            const response = await api.tables.getAll()
            return response.data || []
        },

        // GET /api/tables/available - Lấy bàn trống
        getAvailable: async (): Promise<Table[]> => {
            const response = await api.tables.getAvailable()
            return response.data || []
        },

        // GET /api/tables/:id - Lấy bàn theo ID
        getById: async (id: number): Promise<Table> => {
            const response = await api.tables.getById(id)
            return response.data
        },

        // POST /api/tables - Tạo bàn mới
        // body: { table_name }
        create: async (data: CreateTableData): Promise<Table> => {
            // Map frontend 'name' to backend 'table_name'
            const backendData = {
                table_name: data.name || data.table_name || '',
            }
            const response = await api.tables.create(backendData)
            return response.data
        },

        // POST /api/tables/merge - Gộp bàn
        // body: { hostId, tableIds: [2,3,4] }
        merge: async (hostId: number, tableIds: number[]): Promise<Table> => {
            const response = await api.tables.merge({ hostId, tableIds })
            return response.data
        },

        // POST /api/tables/:id/split - Tách bàn đã gộp
        split: async (hostId: number): Promise<Table> => {
            const response = await api.tables.split(hostId)
            return response.data
        },

        // POST /api/tables/:id/occupy - Đặt bàn (empty → occupied)
        occupy: async (id: number): Promise<Table> => {
            const response = await api.tables.occupy(id)
            return response.data
        },

        // POST /api/tables/:id/checkout - Checkout bàn (occupied → empty)
        checkout: async (id: number): Promise<Table> => {
            const response = await api.tables.checkout(id)
            return response.data
        },

        // PATCH /api/tables/:id/status - Cập nhật trạng thái bàn
        // body: { status: 'empty'|'occupied' }
        updateStatus: async (id: number, status: 'empty' | 'occupied'): Promise<Table> => {
            const response = await api.tables.updateStatus(id, { status })
            return response.data
        },

        // PATCH /api/tables/:id - Cập nhật thông tin bàn
        // body: { table_name }
        update: async (id: number, data: CreateTableData): Promise<Table> => {
            // Map frontend 'name' to backend 'table_name'
            const backendData = {
                table_name: data.name || data.table_name || '',
            }
            const response = await api.tables.update(id, backendData)
            return response.data
        },

        // DELETE /api/tables/:id - Xóa bàn
        delete: async (id: number): Promise<void> => {
            await api.tables.delete(id)
        },
    },

    /**
     * ===============================================
     * ORDERS APIs - Quản lý đơn hàng (Simplified)
     * ===============================================
     * Base URL: /api/orders
     * Note: Chỉ có payment_status (unpaid/paid), không có status phức tạp
     */
    order: {
        // GET /api/orders - Lấy tất cả đơn hàng
        getAll: async (): Promise<Order[]> => {
            const response = await api.orders.getAll()
            return response.data || []
        },

        // GET /api/orders/:id - Lấy đơn hàng theo ID
        getById: async (id: number): Promise<Order> => {
            const response = await api.orders.getById(id)
            return response.data
        },

        // GET /api/orders/statistics - Lấy thống kê đơn hàng (cho dashboard)
        getStatistics: async (): Promise<Record<string, number>> => {
            return await api.orders.getStatistics()
        },

        // GET /api/orders/by-payment/:payment_status - Lấy theo trạng thái thanh toán
        // payment_status: 'unpaid' | 'paid'
        getByPaymentStatus: async (payment_status: 'unpaid' | 'paid'): Promise<Order[]> => {
            const response = await api.orders.getByPaymentStatus(payment_status)
            return response.data || []
        },

        // GET /api/orders/takeaway - Lấy đơn hàng mang đi
        getTakeaway: async (): Promise<Order[]> => {
            const response = await api.orders.getTakeaway()
            return response.data || []
        },

        // GET /api/orders/table/:tableId - Lấy orders của bàn (dùng cho /tables/:id)
        getByTable: async (tableId: number): Promise<Order[]> => {
            const response = await api.orders.getByTable(tableId)
            return response.data || []
        },

        // POST /api/orders/takeaway - Tạo đơn hàng mang đi
        // body: { items: [{ menu_item_id, quantity }], customer_name?, notes? }
        createTakeaway: async (data: CreateOrderData): Promise<Order> => {
            const response = await api.orders.createTakeaway(data)
            return response.data
        },

        // POST /api/orders/table/:tableId - Tạo đơn hàng cho bàn
        // body: { items: [{ menu_item_id, quantity }], customer_name?, notes? }
        createForTable: async (tableId: number, data: CreateOrderData): Promise<Order> => {
            const response = await api.orders.createForTable(tableId, data)
            return response.data
        },

        // PATCH /api/orders/:id/payment - Cập nhật trạng thái thanh toán (unpaid → paid)
        // body: { payment_status: 'paid' }
        updatePayment: async (id: number, payment_status: 'paid' = 'paid'): Promise<Order> => {
            const response = await api.orders.updatePayment(id, { payment_status })
            return response.data
        },

        // DELETE /api/orders/:id - Xóa đơn hàng
        delete: async (id: number): Promise<void> => {
            await api.orders.delete(id)
        },

        // ===== DEPRECATED APIs (không còn sử dụng) =====
        // POST /api/orders - REMOVED (sử dụng createTakeaway hoặc createForTable thay thế)
        // PATCH /api/orders/:id/status - REMOVED (chỉ có payment_status)
        // GET /api/orders/by-status/:status - REMOVED (chỉ có by-payment)
    },

    /**
     * ===============================================
     * AUTH APIs - Quản lý xác thực
     * ===============================================
     * Base URL: /api/auth
     */
    auth: {
        // POST /api/auth/login - Đăng nhập bằng code
        // body: { code }
        login: async (code: string): Promise<{ apiKey: string; expiresAt: string }> => {
            const response = await api.auth.login({ code })
            return response.data
        },
    },
}

/**
 * ===============================================
 * HELPER FUNCTIONS - Utilities cho frontend
 * ===============================================
 */
export const apiHelpers = {
    // Format order items từ form data
    formatOrderItems(
        items: Array<{ id?: number; menu_item_id?: number; quantity?: number }>,
    ): OrderItem[] {
        return items.map((item) => ({
            menu_item_id: item.id || item.menu_item_id || 0,
            quantity: item.quantity || 1,
        }))
    },

    // Check if table has unpaid orders
    hasUnpaidOrders(orders: Order[]): boolean {
        return orders && orders.some((order) => order.payment_status === 'unpaid')
    },

    // Calculate total from order items
    calculateTotal(items: OrderItem[], menuItems: MenuItem[]): number {
        return items.reduce((total, item) => {
            const menuItem = menuItems.find((m) => m.id === item.menu_item_id)
            return total + (menuItem ? menuItem.price * item.quantity : 0)
        }, 0)
    },

    // Format table display name
    formatTableName(table: Table): string {
        if (table.is_merged && table.role === 'HOST') {
            return `${table.table_name} (Gộp ${table.merged_tables?.length || 0} bàn)`
        }
        return table.table_name
    },
}

export default apiService

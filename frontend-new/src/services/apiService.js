import { api } from './api.js'

/**
 * ===============================================
 * CAFE MANAGER API SERVICE
 * ===============================================
 * API service layer cho frontend - Cập nhật theo backend mới
 * Chú thích rõ ràng cho từng API endpoint
 * ===============================================
 */

const apiService = {
    /**
     * ===============================================
     * MENU APIs - Quản lý thực đơn
     * ===============================================
     * Base URL: /api/menu
     */
    menu: {
        // GET /api/menu - Lấy tất cả menu items
        getAll: async () => {
            try {
                console.log('🍽️ Fetching menu items...')
                const response = await api.get('/menu')
                console.log('🍽️ Menu response:', response)
                return response.data || [] // Backend trả về {status, data, count}
            } catch (error) {
                console.error('🍽️ Menu getAll failed:', error)
                // Nếu là lỗi authentication, không cần throw lại vì api.js đã handle
                if (error.message && error.message.includes('401')) {
                    return [] // Return empty array để tránh crash UI
                }
                throw error
            }
        },

        // GET /api/menu/:id - Lấy menu item theo ID
        getById: async (id) => {
            const response = await api.get(`/menu/${id}`)
            return response.data
        },

        // POST /api/menu - Tạo menu item mới
        // body: { name, price, category, image_url }
        create: async (data) => {
            const response = await api.post('/menu', data)
            return response.data
        },

        // PATCH /api/menu/:id - Cập nhật menu item
        update: async (id, data) => {
            const response = await api.patch(`/menu/${id}`, data)
            return response.data
        },

        // DELETE /api/menu/:id - Xóa menu item
        delete: async (id) => {
            const response = await api.delete(`/menu/${id}`)
            return response
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
        getAll: async () => {
            const response = await api.get('/tables')
            return response.data || []
        },

        // GET /api/tables/available - Lấy bàn trống
        getAvailable: async () => {
            const response = await api.get('/tables/available')
            return response.data || []
        },

        // GET /api/tables/:id - Lấy bàn theo ID
        getById: async (id) => {
            const response = await api.get(`/tables/${id}`)
            return response.data
        },

        // POST /api/tables - Tạo bàn mới
        // body: { table_name }
        create: async (data) => {
            // Map frontend 'name' to backend 'table_name'
            const backendData = {
                table_name: data.name || data.table_name,
            }
            const response = await api.post('/tables', backendData)
            return response.data
        },

        // POST /api/tables/merge - Gộp bàn
        // body: { hostId, tableIds: [2,3,4] }
        merge: async (hostId, tableIds) => {
            const response = await api.post('/tables/merge', { hostId, tableIds })
            return response.data
        },

        // POST /api/tables/:id/split - Tách bàn đã gộp
        split: async (hostId) => {
            const response = await api.post(`/tables/${hostId}/split`)
            return response.data
        },

        // POST /api/tables/:id/occupy - Đặt bàn (empty → occupied)
        occupy: async (id) => {
            const response = await api.post(`/tables/${id}/occupy`)
            return response.data
        },

        // POST /api/tables/:id/checkout - Checkout bàn (occupied → empty)
        checkout: async (id) => {
            const response = await api.post(`/tables/${id}/checkout`)
            return response.data
        },

        // PATCH /api/tables/:id/status - Cập nhật trạng thái bàn
        // body: { status: 'empty'|'occupied' }
        updateStatus: async (id, status) => {
            const response = await api.patch(`/tables/${id}/status`, { status })
            return response.data
        },

        // PATCH /api/tables/:id - Cập nhật thông tin bàn
        // body: { table_name }
        update: async (id, data) => {
            // Map frontend 'name' to backend 'table_name'
            const backendData = {
                table_name: data.name || data.table_name,
            }
            const response = await api.patch(`/tables/${id}`, backendData)
            return response.data
        },

        // DELETE /api/tables/:id - Xóa bàn
        delete: async (id) => {
            const response = await api.delete(`/tables/${id}`)
            return response
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
        getAll: async () => {
            const response = await api.get('/orders')
            return response.data || []
        },

        // GET /api/orders/:id - Lấy đơn hàng theo ID
        getById: async (id) => {
            const response = await api.get(`/orders/${id}`)
            return response.data
        },

        // GET /api/orders/statistics - Lấy thống kê đơn hàng (cho dashboard)
        getStatistics: async () => {
            const response = await api.get('/orders/statistics')
            return response.data
        },

        // GET /api/orders/by-payment/:payment_status - Lấy theo trạng thái thanh toán
        // payment_status: 'unpaid' | 'paid'
        getByPaymentStatus: async (payment_status) => {
            const response = await api.get(`/orders/by-payment/${payment_status}`)
            return response.data || []
        },

        // GET /api/orders/takeaway - Lấy đơn hàng mang đi
        getTakeaway: async () => {
            const response = await api.get('/orders/takeaway')
            return response.data || []
        },

        // GET /api/orders/table/:tableId - Lấy orders của bàn (dùng cho /tables/:id)
        getByTable: async (tableId) => {
            const response = await api.get(`/orders/table/${tableId}`)
            return response.data || []
        },

        // POST /api/orders/takeaway - Tạo đơn hàng mang đi
        // body: { items: [{ menu_item_id, quantity }], customer_name?, notes? }
        createTakeaway: async (data) => {
            const response = await api.post('/orders/takeaway', data)
            return response.data
        },

        // POST /api/orders/table/:tableId - Tạo đơn hàng cho bàn
        // body: { items: [{ menu_item_id, quantity }], customer_name?, notes? }
        createForTable: async (tableId, data) => {
            const response = await api.post(`/orders/table/${tableId}`, data)
            return response.data
        },

        // PATCH /api/orders/:id/payment - Cập nhật trạng thái thanh toán (unpaid → paid)
        // body: { payment_status: 'paid' }
        updatePayment: async (id, payment_status = 'paid') => {
            const response = await api.patch(`/orders/${id}/payment`, { payment_status })
            return response.data
        },

        // DELETE /api/orders/:id - Xóa đơn hàng
        delete: async (id) => {
            const response = await api.delete(`/orders/${id}`)
            return response
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
        login: async (code) => {
            const response = await api.post('/auth/login', { code })
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
    formatOrderItems(items) {
        return items.map((item) => ({
            menu_item_id: item.id || item.menu_item_id,
            quantity: item.quantity || 1,
        }))
    },

    // Check if table has unpaid orders
    hasUnpaidOrders(orders) {
        return orders && orders.some((order) => order.payment_status === 'unpaid')
    },

    // Calculate total from order items
    calculateTotal(items, menuItems) {
        return items.reduce((total, item) => {
            const menuItem = menuItems.find((m) => m.id === item.menu_item_id)
            return total + (menuItem ? menuItem.price * item.quantity : 0)
        }, 0)
    },

    // Format table display name
    formatTableName(table) {
        if (table.is_merged && table.role === 'HOST') {
            return `${table.table_name} (Gộp ${table.merged_tables?.length || 0} bàn)`
        }
        return table.table_name
    },

    // Get table status color for UI
    getTableStatusColor(table, orders = []) {
        if (table.status === 'empty') return 'green'
        if (apiHelpers.hasUnpaidOrders(orders)) return 'red'
        return 'blue' // occupied but paid
    },
}

export default apiService

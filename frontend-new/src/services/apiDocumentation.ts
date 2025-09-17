/**
 * ===============================================
 * CAFE MANAGER API DOCUMENTATION
 * ===============================================
 * Tài liệu đầy đủ tất cả APIs backend cho cafe manager
 * Cập nhật: September 2025
 * ===============================================
 */

export const API_DOCUMENTATION = {
    // ===== AUTHENTICATION APIs =====
    auth: {
        base: '/api/auth',
        endpoints: {
            // POST /api/auth/login - Đăng nhập bằng code
            login: {
                method: 'POST',
                url: '/auth/login',
                description: 'Đăng nhập và lấy API key',
                body: {
                    code: 'string (required) - Mã đăng nhập',
                },
                response: {
                    success: true,
                    message: 'Login successful',
                    data: {
                        apiKey: 'string - API key để xác thực',
                        expiresAt: 'ISO date - Thời hạn hết hạn',
                    },
                },
            },
        },
    },

    // ===== MENU APIs =====
    menu: {
        base: '/api/menu',
        description: 'Quản lý thực đơn (menu items)',
        endpoints: {
            // GET /api/menu - Lấy tất cả menu items
            getAll: {
                method: 'GET',
                url: '/menu',
                description: 'Lấy danh sách tất cả món ăn',
                response: {
                    status: 'success',
                    data: '[Array] - Danh sách món ăn',
                    count: 'number - Số lượng món',
                },
            },

            // GET /api/menu/:id - Lấy menu item theo ID
            getById: {
                method: 'GET',
                url: '/menu/:id',
                description: 'Lấy thông tin chi tiết 1 món ăn',
                params: { id: 'number - ID món ăn' },
                response: {
                    status: 'success',
                    data: {
                        id: 'number',
                        name: 'string - Tên món',
                        price: 'number - Giá',
                        category: 'string - coffee|tea|juice|food|other',
                        image_url: 'string - URL ảnh',
                    },
                },
            },

            // POST /api/menu - Tạo menu item mới
            create: {
                method: 'POST',
                url: '/menu',
                description: 'Thêm món ăn mới vào thực đơn',
                body: {
                    name: 'string (required) - Tên món',
                    price: 'number (required) - Giá',
                    category: 'string - coffee|tea|juice|food|other',
                    image_url: 'string - URL ảnh',
                },
                response: {
                    status: 'success',
                    message: 'Tạo menu item thành công',
                    data: 'object - Menu item vừa tạo',
                },
            },

            // PUT /api/menu/:id - Cập nhật menu item
            update: {
                method: 'PUT',
                url: '/menu/:id',
                description: 'Cập nhật thông tin món ăn',
                params: { id: 'number - ID món ăn' },
                body: {
                    name: 'string - Tên món',
                    price: 'number - Giá',
                    category: 'string - coffee|tea|juice|food|other',
                    image_url: 'string - URL ảnh',
                },
            },

            // DELETE /api/menu/:id - Xóa menu item
            delete: {
                method: 'DELETE',
                url: '/menu/:id',
                description: 'Xóa món ăn khỏi thực đơn',
                params: { id: 'number - ID món ăn' },
            },
        },
    },

    // ===== TABLES APIs =====
    tables: {
        base: '/api/tables',
        description: 'Quản lý bàn ăn - Core feature cho trang Tables',
        endpoints: {
            // GET /api/tables - Lấy tất cả bàn
            getAll: {
                method: 'GET',
                url: '/tables',
                description: 'Lấy danh sách tất cả bàn (dùng cho grid Tables)',
                response: {
                    status: 'success',
                    data: '[Array] - Danh sách bàn',
                    sample_item: {
                        id: 'number - ID bàn',
                        table_name: 'string - Tên bàn (VD: "Bàn 01")',
                        status: 'string - empty|occupied',
                        role: 'string - HOST|CHILD|NORMAL',
                        is_merged: 'boolean - Có đang gộp không',
                        host_id: 'number|null - ID bàn chủ nếu là bàn con',
                        merged_tables: '[Array]|null - Danh sách ID các bàn được gộp',
                        created_at: 'ISO date',
                        updated_at: 'ISO date',
                    },
                },
            },

            // GET /api/tables/available - Lấy bàn trống
            getAvailable: {
                method: 'GET',
                url: '/tables/available',
                description: 'Lấy danh sách bàn trống (status=empty)',
            },

            // GET /api/tables/:id - Lấy bàn theo ID
            getById: {
                method: 'GET',
                url: '/tables/:id',
                description: 'Lấy thông tin chi tiết 1 bàn',
                params: { id: 'number - ID bàn' },
            },

            // POST /api/tables - Tạo bàn mới
            create: {
                method: 'POST',
                url: '/tables',
                description: 'Thêm bàn mới',
                body: {
                    table_name: 'string (required) - Tên bàn (VD: "Bàn VIP 01")',
                },
            },

            // POST /api/tables/merge - Gộp bàn
            merge: {
                method: 'POST',
                url: '/tables/merge',
                description: 'Gộp nhiều bàn thành 1 (orders sẽ chuyển về host)',
                body: {
                    hostId: 'number (required) - ID bàn chủ',
                    tableIds: '[Array] (required) - Danh sách ID bàn con (không bao gồm host)',
                },
                example: {
                    hostId: 1,
                    tableIds: [2, 3, 4], // Gộp bàn 1 với bàn 2,3,4
                },
            },

            // POST /api/tables/:id/split - Tách bàn
            split: {
                method: 'POST',
                url: '/tables/:id/split',
                description: 'Tách bàn đã gộp (orders vẫn thuộc host)',
                params: { id: 'number - ID bàn host' },
            },

            // POST /api/tables/:id/occupy - Đặt bàn
            occupy: {
                method: 'POST',
                url: '/tables/:id/occupy',
                description: 'Chuyển bàn sang trạng thái occupied',
                params: { id: 'number - ID bàn' },
            },

            // POST /api/tables/:id/checkout - Checkout bàn
            checkout: {
                method: 'POST',
                url: '/tables/:id/checkout',
                description: 'Chuyển bàn về trạng thái empty',
                params: { id: 'number - ID bàn' },
            },

            // PATCH /api/tables/:id/status - Cập nhật trạng thái bàn
            updateStatus: {
                method: 'PATCH',
                url: '/tables/:id/status',
                description: 'Cập nhật trạng thái bàn',
                params: { id: 'number - ID bàn' },
                body: { status: 'string - empty|occupied' },
            },
        },
    },

    // ===== ORDERS APIs =====
    orders: {
        base: '/api/orders',
        description: 'Quản lý đơn hàng - Simplified với chỉ 2 trạng thái: unpaid/paid',
        endpoints: {
            // GET /api/orders - Lấy tất cả đơn hàng
            getAll: {
                method: 'GET',
                url: '/orders',
                description: 'Lấy danh sách tất cả đơn hàng',
            },

            // GET /api/orders/:id - Lấy đơn hàng theo ID
            getById: {
                method: 'GET',
                url: '/orders/:id',
                description: 'Lấy chi tiết 1 đơn hàng',
                params: { id: 'number - ID đơn hàng' },
            },

            // GET /api/orders/statistics - Lấy thống kê
            getStatistics: {
                method: 'GET',
                url: '/orders/statistics',
                description: 'Lấy thống kê tổng quan đơn hàng (cho dashboard)',
            },

            // GET /api/orders/by-payment/:payment_status - Lấy theo trạng thái thanh toán
            getByPaymentStatus: {
                method: 'GET',
                url: '/orders/by-payment/:payment_status',
                description: 'Lấy đơn hàng theo trạng thái thanh toán',
                params: { payment_status: 'string - unpaid|paid' },
            },

            // GET /api/orders/takeaway - Lấy đơn hàng mang đi
            getTakeaway: {
                method: 'GET',
                url: '/orders/takeaway',
                description: 'Lấy tất cả đơn hàng mang đi',
            },

            // GET /api/orders/table/:tableId - Lấy đơn hàng của bàn
            getByTable: {
                method: 'GET',
                url: '/orders/table/:tableId',
                description: 'Lấy tất cả đơn hàng của 1 bàn (dùng cho trang /tables/:id)',
                params: { tableId: 'number - ID bàn' },
                response: {
                    status: 'success',
                    data: '[Array] - Danh sách orders của bàn',
                    sample_item: {
                        id: 'number - ID order',
                        table_id: 'number - ID bàn',
                        customer_name: 'string|null - Tên khách',
                        order_type: 'string - takeaway|dine_in',
                        payment_status: 'string - unpaid|paid',
                        total: 'number - Tổng tiền',
                        notes: 'string|null - Ghi chú',
                        created_at: 'ISO date',
                        paid_at: 'ISO date|null',
                        items: '[Array] - Chi tiết món ăn',
                    },
                },
            },

            // POST /api/orders/takeaway - Tạo đơn hàng mang đi
            createTakeaway: {
                method: 'POST',
                url: '/orders/takeaway',
                description: 'Tạo đơn hàng mang đi (từ popup trong trang Tables)',
                body: {
                    items: '[Array] (required) - Danh sách món',
                    customer_name: 'string - Tên khách (optional)',
                    notes: 'string - Ghi chú (optional)',
                },
                items_format: [
                    {
                        menu_item_id: 'number - ID món ăn',
                        quantity: 'number - Số lượng',
                    },
                ],
            },

            // POST /api/orders/table/:tableId - Tạo đơn hàng cho bàn
            createForTable: {
                method: 'POST',
                url: '/orders/table/:tableId',
                description: 'Tạo đơn hàng cho bàn (từ trang /tables/:id)',
                params: { tableId: 'number - ID bàn' },
                body: {
                    items: '[Array] (required) - Danh sách món',
                    customer_name: 'string - Tên khách (optional)',
                    notes: 'string - Ghi chú (optional)',
                },
                items_format: [
                    {
                        menu_item_id: 'number - ID món ăn',
                        quantity: 'number - Số lượng',
                    },
                ],
            },

            // PUT /api/orders/:id/payment - Cập nhật trạng thái thanh toán
            updatePayment: {
                method: 'PUT',
                url: '/orders/:id/payment',
                description: 'Thanh toán đơn hàng (chuyển từ unpaid → paid)',
                params: { id: 'number - ID đơn hàng' },
                body: { payment_status: 'string - paid' },
            },

            // DELETE /api/orders/:id - Xóa đơn hàng
            delete: {
                method: 'DELETE',
                url: '/orders/:id',
                description: 'Xóa đơn hàng',
                params: { id: 'number - ID đơn hàng' },
            },
        },
    },
}

/**
 * ===============================================
 * FRONTEND INTEGRATION NOTES
 * ===============================================
 */

export const FRONTEND_INTEGRATION = {
    // Luồng chính cho trang Tables
    tablesPageFlow: {
        '1_loadTables': 'GET /api/tables - Load grid bàn',
        '2_tableClick_addOrder': 'Redirect to /tables/:id',
        '3_loadTableOrders': 'GET /api/orders/table/:id - Load orders của bàn',
        '4_addItemsToTable': 'POST /api/orders/table/:id - Thêm món cho bàn',
        '5_payOrder': 'PUT /api/orders/:id/payment - Thanh toán',
        '6_tableStatusUpdate': 'Auto update status base on unpaid orders',
    },

    // Luồng cho Order mang đi
    takeawayFlow: {
        '1_clickTakeaway': 'Mở popup chọn món',
        '2_selectItems': 'Chọn món từ GET /api/menu',
        '3_createOrder': 'POST /api/orders/takeaway',
        '4_payImmediately': 'PUT /api/orders/:id/payment',
    },

    // Luồng gộp/tách bàn
    mergeTableFlow: {
        '1_selectTables': 'Chọn nhiều bàn trên grid',
        '2_chooseHost': 'Chọn bàn chủ',
        '3_mergeAPI': 'POST /api/tables/merge',
        '4_ordersTransfer': 'Backend tự động chuyển orders về host',
    },

    splitTableFlow: {
        '1_clickSplit': 'Click nút tách bàn',
        '2_splitAPI': 'POST /api/tables/:id/split',
        '3_ordersStayWithHost': 'Orders vẫn thuộc host, bàn con về empty',
    },

    // Global state cần thiết
    globalState: {
        currentTable: 'object - Thông tin bàn hiện tại',
        currentOrders: '[Array] - Orders của bàn hiện tại',
        allTables: '[Array] - Tất cả bàn (cho grid)',
        isLoading: 'boolean - Loading state',
    },
}

export default API_DOCUMENTATION

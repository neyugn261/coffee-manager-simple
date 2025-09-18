// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

import type { MenuItem, Table, Order } from '@/lib/types'

// Specific types for API data structures

interface OrderItem {
    menu_item_id: number
    quantity: number
}

interface AuthResponse {
    apiKey: string
    expiresAt: string
}

// API Response wrappers
interface MenuResponse {
    status: string
    data: MenuItem[]
    count?: number
}

interface MenuItemResponse {
    status: string
    data: MenuItem
    message?: string
}

interface TableResponse {
    status: string
    data: Table[]
}

interface TableItemResponse {
    status: string
    data: Table
    message?: string
}

interface OrderResponse {
    status: string
    data: Order[]
}

interface OrderItemResponse {
    status: string
    data: Order
    message?: string
}

interface AuthLoginResponse {
    success: boolean
    message: string
    data: AuthResponse
}

interface DeleteResponse {
    status: string
    message: string
}

// Request body types
interface CreateMenuItemRequest {
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

interface CreateTableRequest {
    table_name: string
}

interface CreateOrderRequest {
    items: OrderItem[]
    customer_name?: string
    notes?: string
}

interface UpdateTableStatusRequest {
    status: 'empty' | 'occupied'
}

interface UpdatePaymentRequest {
    payment_status: 'paid'
}

interface MergeTablesRequest {
    hostId: number
    tableIds: number[]
}

interface LoginRequest {
    code: string
}

// Request options interface
interface RequestOptions extends RequestInit {
    headers?: Record<string, string>
}

// Get authentication headers
const getAuthHeaders = (): Record<string, string> => {
    const apiKey = localStorage.getItem('apiKey')
    console.log('Current API Key:', apiKey ? 'Present' : 'Not found')

    // Temporary API key for testing - Remove this in production
    if (!apiKey) {
        console.log('No API key found, requests will fail without authentication')
        return {}
    }

    return {
        Authorization: `Bearer ${apiKey}`,
    }
}

// Specific API request functions
const apiRequest = async (endpoint: string, options: RequestOptions = {}): Promise<Response> => {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), // Tự động thêm auth headers
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, config)

        // Nếu 401 (Unauthorized), chuyển về trang login
        if (response.status === 401) {
            localStorage.removeItem('apiKey')
            localStorage.removeItem('apiKeyExpires')
            window.location.href = '/login'
            throw new Error('Unauthorized')
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('API Error Details:', errorData)
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        return response
    } catch (error) {
        console.error('API Request failed:', error)
        throw error
    }
}

// API methods with specific types
export const api = {
    // Menu APIs
    menu: {
        getAll: async (): Promise<MenuResponse> => {
            const response = await apiRequest('/menu')
            return response.json()
        },
        getById: async (id: number): Promise<MenuItemResponse> => {
            const response = await apiRequest(`/menu/${id}`)
            return response.json()
        },
        create: async (data: CreateMenuItemRequest): Promise<MenuItemResponse> => {
            const response = await apiRequest('/menu', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        update: async (
            id: number,
            data: Partial<CreateMenuItemRequest>,
        ): Promise<MenuItemResponse> => {
            const response = await apiRequest(`/menu/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        delete: async (id: number): Promise<DeleteResponse> => {
            const response = await apiRequest(`/menu/${id}`, {
                method: 'DELETE',
            })
            return response.json()
        },
    },

    // Table APIs
    tables: {
        getAll: async (): Promise<TableResponse> => {
            const response = await apiRequest('/tables')
            return response.json()
        },
        getAvailable: async (): Promise<TableResponse> => {
            const response = await apiRequest('/tables/available')
            return response.json()
        },
        getById: async (id: number): Promise<TableItemResponse> => {
            const response = await apiRequest(`/tables/${id}`)
            return response.json()
        },
        create: async (data: CreateTableRequest): Promise<TableItemResponse> => {
            const response = await apiRequest('/tables', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        merge: async (data: MergeTablesRequest): Promise<TableItemResponse> => {
            const response = await apiRequest('/tables/merge', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        split: async (hostId: number): Promise<TableItemResponse> => {
            const response = await apiRequest(`/tables/${hostId}/split`, {
                method: 'POST',
            })
            return response.json()
        },
        occupy: async (id: number): Promise<TableItemResponse> => {
            const response = await apiRequest(`/tables/${id}/occupy`, {
                method: 'POST',
            })
            return response.json()
        },
        checkout: async (id: number): Promise<TableItemResponse> => {
            const response = await apiRequest(`/tables/${id}/checkout`, {
                method: 'POST',
            })
            return response.json()
        },
        updateStatus: async (
            id: number,
            data: UpdateTableStatusRequest,
        ): Promise<TableItemResponse> => {
            const response = await apiRequest(`/tables/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        update: async (id: number, data: CreateTableRequest): Promise<TableItemResponse> => {
            const response = await apiRequest(`/tables/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        delete: async (id: number): Promise<DeleteResponse> => {
            const response = await apiRequest(`/tables/${id}`, {
                method: 'DELETE',
            })
            return response.json()
        },
    },

    // Order APIs
    orders: {
        getAll: async (): Promise<OrderResponse> => {
            const response = await apiRequest('/orders')
            return response.json()
        },
        getById: async (id: number): Promise<OrderItemResponse> => {
            const response = await apiRequest(`/orders/${id}`)
            return response.json()
        },
        getStatistics: async (): Promise<Record<string, number>> => {
            const response = await apiRequest('/orders/statistics')
            return response.json()
        },
        getByPaymentStatus: async (status: 'unpaid' | 'paid'): Promise<OrderResponse> => {
            const response = await apiRequest(`/orders/by-payment/${status}`)
            return response.json()
        },
        getTakeaway: async (): Promise<OrderResponse> => {
            const response = await apiRequest('/orders/takeaway')
            return response.json()
        },
        getByTable: async (tableId: number): Promise<OrderResponse> => {
            const response = await apiRequest(`/orders/table/${tableId}`)
            return response.json()
        },
        createTakeaway: async (data: CreateOrderRequest): Promise<OrderItemResponse> => {
            const response = await apiRequest('/orders/takeaway', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        createForTable: async (
            tableId: number,
            data: CreateOrderRequest,
        ): Promise<OrderItemResponse> => {
            const response = await apiRequest(`/orders/table/${tableId}`, {
                method: 'POST',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        updatePayment: async (
            id: number,
            data: UpdatePaymentRequest,
        ): Promise<OrderItemResponse> => {
            const response = await apiRequest(`/orders/${id}/payment`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            return response.json()
        },
        delete: async (id: number): Promise<DeleteResponse> => {
            const response = await apiRequest(`/orders/${id}`, {
                method: 'DELETE',
            })
            return response.json()
        },
    },

    // Auth APIs
    auth: {
        login: async (data: LoginRequest): Promise<AuthLoginResponse> => {
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            return response.json()
        },
    },
}

export default api

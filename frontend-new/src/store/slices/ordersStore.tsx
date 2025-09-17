/**
 * Orders Store with API integration using React Context
 * Note: Some methods are disabled because they're not available in the current API service
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import apiService from '../../services/apiService'
import type { Order, OrderStatus, OrderLine } from '../../lib/types'

// State types
interface OrdersState {
    orders: Order[]
    loading: boolean
    error: string | null
}

// Action types
type OrdersAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Order[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'CREATE_SUCCESS'; payload: Order }
    | { type: 'UPDATE_SUCCESS'; payload: Order }
    | { type: 'DELETE_SUCCESS'; payload: string }
    | { type: 'CLEAR_ERROR' }

// Context type
interface OrdersContextType {
    state: OrdersState
    actions: {
        fetchOrders: () => Promise<void>
        createOrder: (data: {
            type: 'eat-in' | 'take-away'
            tableId?: string
            lines: OrderLine[]
            notes?: string
        }) => Promise<void>
        updateOrder: (
            id: string,
            data: Partial<{
                type: 'eat-in' | 'take-away'
                tableId?: string
                lines: OrderLine[]
                notes?: string
            }>,
        ) => Promise<void>
        updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
        attachServer: (id: string, serverId: number) => Promise<void>
        addLine: (id: string, line: OrderLine) => Promise<void>
        updateLine: (orderId: string, lineIndex: number, line: Partial<OrderLine>) => Promise<void>
        removeLine: (orderId: string, lineIndex: number) => Promise<void>
        deleteOrder: (id: string) => Promise<void>
        clearError: () => void
    }
}

// Initial state
const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
}

// Reducer
const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, orders: action.payload }
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload }
        case 'CREATE_SUCCESS':
            return { ...state, loading: false, orders: [...state.orders, action.payload] }
        case 'UPDATE_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: state.orders.map((order) =>
                    order.id === action.payload.id ? action.payload : order,
                ),
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: state.orders.filter((order) => order.id !== action.payload),
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

// Context
const OrdersContext = createContext<OrdersContextType | null>(null)

// Provider component
export function OrdersProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(ordersReducer, initialState)

    // Actions
    const fetchOrders = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const orders = await apiService.order.getAll()
            dispatch({ type: 'FETCH_SUCCESS', payload: orders })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to fetch orders',
            })
        }
    }, [])

    const createOrder = useCallback(
        async (data: {
            type: 'eat-in' | 'take-away'
            tableId?: string
            lines: OrderLine[]
            notes?: string
        }) => {
            dispatch({ type: 'FETCH_START' })
            try {
                let newOrder
                if (data.type === 'take-away') {
                    // Transform lines to items format expected by API
                    const items = data.lines.map((line) => ({
                        menu_item_id: line.item.id,
                        quantity: line.qty,
                    }))

                    // Chỉ tạo đơn hàng nếu có ít nhất 1 item
                    if (items.length === 0) {
                        throw new Error('Đơn hàng phải có ít nhất 1 món')
                    }

                    newOrder = await apiService.order.createTakeaway({
                        items,
                        notes: data.notes,
                    })
                } else if (data.type === 'eat-in' && data.tableId) {
                    const items = data.lines.map((line) => ({
                        menu_item_id: line.item.id,
                        quantity: line.qty,
                    }))
                    const payload = {
                        items,
                        notes: data.notes,
                    }
                    console.log('Creating table order with payload:', payload)
                    console.log('Table ID:', data.tableId)
                    newOrder = await apiService.order.createForTable(data.tableId, payload)
                } else {
                    throw new Error('Table ID is required for eat-in orders')
                }
                dispatch({ type: 'CREATE_SUCCESS', payload: newOrder })
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to create order',
                })
            }
        },
        [],
    )

    const updateOrder = useCallback(
        async (
            _id: string,
            _data: Partial<{
                type: 'eat-in' | 'take-away'
                tableId?: string
                lines: OrderLine[]
                notes?: string
            }>,
        ) => {
            dispatch({ type: 'FETCH_START' })
            try {
                // Note: The current API service doesn't have a generic update order method
                // This functionality would need to be implemented in the backend
                throw new Error('Order update not supported by current API')
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to update order',
                })
            }
        },
        [],
    )

    const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
        dispatch({ type: 'FETCH_START' })
        try {
            // The API service only supports payment status updates (unpaid/paid)
            // Map Status to payment status
            if (status === 'paid') {
                const updatedOrder = await apiService.order.updatePayment(id, 'paid')
                dispatch({ type: 'UPDATE_SUCCESS', payload: updatedOrder })
            } else {
                throw new Error(
                    `Status "${status}" not supported. Only payment status updates are available.`,
                )
            }
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to update order status',
            })
        }
    }, [])

    const attachServer = useCallback(async (_id: string, _serverId: number) => {
        dispatch({ type: 'FETCH_START' })
        try {
            // Note: Server attachment is not available in the current API service
            throw new Error('Server attachment not supported by current API')
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to attach server',
            })
        }
    }, [])

    const addLine = useCallback(async (_id: string, _line: OrderLine) => {
        dispatch({ type: 'FETCH_START' })
        try {
            // Note: Order line management is not available in the current API service
            throw new Error('Order line addition not supported by current API')
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to add line',
            })
        }
    }, [])

    const updateLine = useCallback(
        async (_orderId: string, _lineIndex: number, _line: Partial<OrderLine>) => {
            dispatch({ type: 'FETCH_START' })
            try {
                // Note: Order line management is not available in the current API service
                throw new Error('Order line update not supported by current API')
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to update line',
                })
            }
        },
        [],
    )

    const removeLine = useCallback(async (_orderId: string, _lineIndex: number) => {
        dispatch({ type: 'FETCH_START' })
        try {
            // Note: Order line management is not available in the current API service
            throw new Error('Order line removal not supported by current API')
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to remove line',
            })
        }
    }, [])

    const deleteOrder = useCallback(async (id: string) => {
        dispatch({ type: 'FETCH_START' })
        try {
            await apiService.order.delete(id)
            dispatch({ type: 'DELETE_SUCCESS', payload: id })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to delete order',
            })
        }
    }, [])

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' })
    }, [])

    const value: OrdersContextType = {
        state,
        actions: {
            fetchOrders,
            createOrder,
            updateOrder,
            updateOrderStatus,
            attachServer,
            addLine,
            updateLine,
            removeLine,
            deleteOrder,
            clearError,
        },
    }

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

// Hook to use orders context
export function useOrders() {
    const context = useContext(OrdersContext)
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider')
    }
    return context
}

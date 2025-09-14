/**
 * Tables Store with API integration using React Context
 */

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import apiService from '../../services/apiService.js'
import type { Table, TableStatus } from '../../lib/types'

// State types
interface TablesState {
    tables: Table[]
    loading: boolean
    error: string | null
}

// Action types
type TablesAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Table[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'CREATE_SUCCESS'; payload: Table }
    | { type: 'UPDATE_SUCCESS'; payload: Table }
    | { type: 'DELETE_SUCCESS'; payload: number }
    | { type: 'CLEAR_ERROR' }

// Context type
interface TablesContextType {
    state: TablesState
    actions: {
        fetchTables: () => Promise<void>
        createTable: (data: { name: string }) => Promise<void>
        updateTable: (
            id: number,
            data: Partial<{ name: string; status?: TableStatus }>,
        ) => Promise<void>
        deleteTable: (id: number) => Promise<void>
        updateTableStatus: (id: number, status: TableStatus) => Promise<void>
        clearError: () => void
    }
}

// Initial state
const initialState: TablesState = {
    tables: [],
    loading: false,
    error: null,
}

// Reducer
const tablesReducer = (state: TablesState, action: TablesAction): TablesState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, tables: action.payload }
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload }
        case 'CREATE_SUCCESS':
            return { ...state, loading: false, tables: [...state.tables, action.payload] }
        case 'UPDATE_SUCCESS':
            return {
                ...state,
                loading: false,
                tables: state.tables.map((table) =>
                    table.id === action.payload.id ? action.payload : table,
                ),
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loading: false,
                tables: state.tables.filter((table) => table.id !== action.payload),
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

// Context
const TablesContext = createContext<TablesContextType | null>(null)

// Provider component
export function TablesProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(tablesReducer, initialState)

    // Actions
    const fetchTables = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const tables = await apiService.table.getAll()
            dispatch({ type: 'FETCH_SUCCESS', payload: tables })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to fetch tables',
            })
        }
    }, [])

    const createTable = useCallback(async (data: { name: string }) => {
        dispatch({ type: 'FETCH_START' })
        try {
            const newTable = await apiService.table.create(data)
            dispatch({ type: 'CREATE_SUCCESS', payload: newTable })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to create table',
            })
        }
    }, [])

    const updateTable = useCallback(
        async (id: number, data: Partial<{ name: string; status?: TableStatus }>) => {
            dispatch({ type: 'FETCH_START' })
            try {
                if (data.status) {
                    const updatedTable = await apiService.table.updateStatus(id, data.status)
                    dispatch({ type: 'UPDATE_SUCCESS', payload: updatedTable })
                } else if (data.name) {
                    const updatedTable = await apiService.table.update(id, { name: data.name })
                    dispatch({ type: 'UPDATE_SUCCESS', payload: updatedTable })
                } else {
                    throw new Error('No data provided for update')
                }
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to update table',
                })
            }
        },
        [],
    )

    const updateTableStatus = useCallback(async (id: number, status: TableStatus) => {
        dispatch({ type: 'FETCH_START' })
        try {
            const updatedTable = await apiService.table.updateStatus(id, status)
            dispatch({ type: 'UPDATE_SUCCESS', payload: updatedTable })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to update table status',
            })
        }
    }, [])

    const deleteTable = useCallback(async (id: number) => {
        dispatch({ type: 'FETCH_START' })
        try {
            await apiService.table.delete(id)
            dispatch({ type: 'DELETE_SUCCESS', payload: id })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to delete table',
            })
        }
    }, [])

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' })
    }, [])

    const value: TablesContextType = {
        state,
        actions: {
            fetchTables,
            createTable,
            updateTable,
            updateTableStatus,
            deleteTable,
            clearError,
        },
    }

    return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>
}

// Hook to use tables context
export function useTables() {
    const context = useContext(TablesContext)
    if (!context) {
        throw new Error('useTables must be used within a TablesProvider')
    }
    return context
}

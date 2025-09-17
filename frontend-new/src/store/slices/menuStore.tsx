/**
 * Menu Store with API integration using React Context
 */

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import apiService from '../../services/apiService'
import type { MenuItem, Category } from '../../lib/types'

// State types
interface MenuState {
    items: MenuItem[]
    loading: boolean
    error: string | null
}

// Action types
type MenuAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: MenuItem[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'CREATE_SUCCESS'; payload: MenuItem }
    | { type: 'UPDATE_SUCCESS'; payload: MenuItem }
    | { type: 'DELETE_SUCCESS'; payload: string }
    | { type: 'CLEAR_ERROR' }

// Context type
interface MenuContextType {
    state: MenuState
    actions: {
        fetchItems: () => Promise<void>
        createItem: (data: {
            name: string
            price: number
            category: Category
            image?: string
        }) => Promise<void>
        updateItem: (
            id: string,
            data: Partial<{ name: string; price: number; category: Category; image?: string }>,
        ) => Promise<void>
        deleteItem: (id: string) => Promise<void>
        clearError: () => void
    }
}

// Initial state
const initialState: MenuState = {
    items: [],
    loading: false,
    error: null,
}

// Reducer
const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, items: action.payload }
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload }
        case 'CREATE_SUCCESS':
            return { ...state, loading: false, items: [...state.items, action.payload] }
        case 'UPDATE_SUCCESS':
            return {
                ...state,
                loading: false,
                items: state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loading: false,
                items: state.items.filter((item) => item.id !== action.payload),
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

// Context
const MenuContext = createContext<MenuContextType | null>(null)

// Provider component
export function MenuProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(menuReducer, initialState)

    // Actions
    const fetchItems = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const items = await apiService.menu.getAll()
            dispatch({ type: 'FETCH_SUCCESS', payload: items })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to fetch menu items',
            })
        }
    }, [])

    const createItem = useCallback(
        async (data: { name: string; price: number; category: Category; image?: string }) => {
            dispatch({ type: 'FETCH_START' })
            try {
                const newItem = await apiService.menu.create(data)
                dispatch({ type: 'CREATE_SUCCESS', payload: newItem })
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to create menu item',
                })
            }
        },
        [],
    )

    const updateItem = useCallback(
        async (
            id: string,
            data: Partial<{ name: string; price: number; category: Category; image?: string }>,
        ) => {
            dispatch({ type: 'FETCH_START' })
            try {
                const updatedItem = await apiService.menu.update(id, data)
                dispatch({ type: 'UPDATE_SUCCESS', payload: updatedItem })
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to update menu item',
                })
            }
        },
        [],
    )

    const deleteItem = useCallback(async (id: string) => {
        dispatch({ type: 'FETCH_START' })
        try {
            await apiService.menu.delete(id)
            dispatch({ type: 'DELETE_SUCCESS', payload: id })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to delete menu item',
            })
        }
    }, [])

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' })
    }, [])

    const value: MenuContextType = {
        state,
        actions: {
            fetchItems,
            createItem,
            updateItem,
            deleteItem,
            clearError,
        },
    }

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

// Hook to use menu context
export function useMenu() {
    const context = useContext(MenuContext)
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider')
    }
    return context
}

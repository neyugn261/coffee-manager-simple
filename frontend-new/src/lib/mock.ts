import { MenuItem, Table, Order } from './types'

export const MENU: MenuItem[] = [
    { id: 1, name: 'Americano', price: 30000, category: 'coffee' },
    { id: 2, name: 'Bánh mì', price: 25000, category: 'food' },
]

export const TABLES: Table[] = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1, // number ID to match backend
    table_name: `Bàn ${i + 1}`, // use table_name field to match backend
    status: 'empty' as const, // use backend status values
    is_merged: false,
    host_id: null,
    merged_tables: null,
    role: 'NORMAL' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}))

export const seedOrders: Order[] = []

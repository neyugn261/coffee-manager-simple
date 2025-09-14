import { MenuItem, Table, Order } from './types'

export const MENU: MenuItem[] = [
    { id: 'm1', name: 'Americano', price: 30000, category: 'drink' },
    { id: 'm2', name: 'Bánh mì', price: 25000, category: 'food' },
]

export const TABLES: Table[] = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1, // number ID to match backend
    table_name: `Bàn ${i + 1}`, // use table_name field to match backend
    status: 'empty', // use backend status values
}))

export const seedOrders: Order[] = []

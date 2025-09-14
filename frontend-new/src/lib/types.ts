export type TableStatus = 'empty' | 'occupied' // Backend table ENUM values
export type OrderStatus = 'pending' | 'serving' | 'paid' // Order status values
export type Status = TableStatus // Keep Status as alias for backward compatibility

export type OrderLine = { item: MenuItem; qty: number }

export type Order = {
    id: string
    serverId?: number
    type: 'eat-in' | 'take-away'
    tableId?: number
    status: OrderStatus // Orders use OrderStatus
    lines: OrderLine[]
    notes?: string
    createdAt: number
}

export type Table = {
    id: number // Khớp với backend INT AUTO_INCREMENT
    table_name: string // Khớp với backend table_name
    status: TableStatus // Tables use TableStatus
    is_merged?: boolean // Backend field
    host_id?: number // Backend field
    merged_tables?: number[] // Backend JSON field - array of table IDs
    role?: 'HOST' | 'CHILD' | 'NORMAL' // Backend computed field
    created_at?: string
    updated_at?: string
}

export type Category = 'drink' | 'food' | 'all'

export type MenuItem = {
    id: string
    name: string
    price: number
    category: Category
    image?: string
}

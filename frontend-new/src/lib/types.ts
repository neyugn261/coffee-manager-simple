export type TableStatus = 'empty' | 'occupied' // Backend table ENUM values
export type OrderStatus = 'pending' | 'serving' | 'paid' // Order status values
export type Status = TableStatus // Keep Status as alias for backward compatibility

export type OrderLine = { item: MenuItem; qty: number }

export type Order = {
    id: number
    table_id?: number
    customer_name?: string | null
    order_type: 'takeaway' | 'dine_in'
    payment_status: 'unpaid' | 'paid'
    total: number
    notes?: string | null
    created_at: string
    paid_at?: string | null
    items: Array<{ menu_item_id: number; quantity: number }>
    // Frontend computed properties
    lines?: OrderLine[]
    type?: 'eat-in' | 'take-away'
    status?: OrderStatus
    tableId?: number
    serverId?: number
    createdAt?: number
}

export type Table = {
    id: number // Khớp với backend INT AUTO_INCREMENT
    table_name: string // Khớp với backend table_name
    status: TableStatus // Tables use TableStatus
    is_merged: boolean // Backend field
    host_id?: number | null // Backend field
    merged_tables?: number[] | null // Backend JSON field - array of table IDs
    role: 'HOST' | 'CHILD' | 'NORMAL' // Backend computed field
    created_at: string
    updated_at: string
}

export type Category =
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
    | 'all'

export type MenuItem = {
    id: number
    name: string
    price: number
    category: Exclude<Category, 'all'>
    image_url?: string
    created_at?: string
    updated_at?: string
}

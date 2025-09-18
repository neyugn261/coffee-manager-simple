import type { Order } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export async function saveOrderToApi(order: Order) {
    const payload = {
        items: order.lines?.map((l) => ({ menu_item_id: l.item.id, quantity: l.qty })) || [],
        customer_name: null,
        order_type: order.type === 'eat-in' ? 'dine_in' : 'takeaway',
        table_number: order.type === 'eat-in' ? order.tableId : null,
        notes: order.notes ?? null,
    }
    const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to save order')
    const data = await res.json()
    return data?.data
}

export async function updateOrderStatusOnApi(serverId: number, status: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${serverId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Failed to update order status')
}
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

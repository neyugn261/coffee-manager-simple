'use client'
import { Badge } from '@/components/ui/badge'
import type { TableStatus, OrderStatus } from '@/lib/types'

type StatusBadgeProps = {
    status: TableStatus | OrderStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStyles = (s: TableStatus | OrderStatus) => {
        if (s === 'empty') return 'bg-green-500/20 text-green-500'
        if (s === 'occupied') return 'bg-red-500/20 text-red-500'
        if (s === 'pending') return 'bg-yellow-500/20 text-yellow-500'
        if (s === 'serving') return 'bg-blue-500/20 text-blue-500'
        if (s === 'paid') return 'bg-green-500/20 text-green-500'
        return 'bg-gray-500/20 text-gray-500'
    }

    return <Badge className={getStyles(status)}>{label(status)}</Badge>
}

function label(s: TableStatus | OrderStatus) {
    if (s === 'empty') return 'Trống'
    if (s === 'occupied') return 'Có khách'
    if (s === 'pending') return 'Chưa phục vụ'
    if (s === 'serving') return 'Đang phục vụ'
    if (s === 'paid') return 'Đã thanh toán'
    return 'Không xác định'
}

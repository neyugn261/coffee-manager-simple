'use client'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatusBadge from './StatusBadge'
import type { TableStatus } from '@/lib/types'

export default function TableCard({
    id,
    name,
    status,
}: {
    id: number
    name: string
    status: TableStatus
}) {
    return (
        <Link href={`/order/eat-in?page=table&tableId=${id}`}>
            <Card className="text-foreground bg-card p-3 duration-300 hover:-translate-y-1 hover:bg-[var(--secondary-hover)] hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">{name}</CardTitle>
                    <StatusBadge status={status} />
                </CardHeader>
                <CardContent className="text-xs opacity-70">Nhấn để mở order</CardContent>
            </Card>
        </Link>
    )
}

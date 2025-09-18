'use client'

import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { Table } from '@/lib/types'

interface TableCardProps {
    table: Table
    onEdit: (table: Table) => void
    onDelete: (id: number) => void
}

export default function TableCard({ table, onEdit, onDelete }: TableCardProps) {
    return (
        <div className="group bg-card border-border relative overflow-hidden rounded-2xl border p-6 shadow-md transition-all duration-200 select-none hover:shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                        🪑
                    </div>
                    <div>
                        <h3 className="text-foreground font-semibold">{table.table_name}</h3>
                        <p className="text-muted-foreground text-sm">Trống</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(table)}
                    className="flex-1"
                >
                    <Edit className="mr-1 h-3 w-3" />
                    Sửa
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(table.id)}
                    className="text-destructive hover:bg-destructive/10 flex-1"
                >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Xóa
                </Button>
            </div>
        </div>
    )
}

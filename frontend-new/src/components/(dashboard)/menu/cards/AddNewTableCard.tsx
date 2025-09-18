'use client'

import { Plus } from 'lucide-react'

interface AddNewTableCardProps {
    onClick: () => void
}

export default function AddNewTableCard({ onClick }: AddNewTableCardProps) {
    return (
        <div
            onClick={onClick}
            className="group border-primary/30 from-primary/5 to-accent/5 hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed bg-gradient-to-br p-6 transition-all duration-200 hover:shadow-lg"
        >
            <div className="text-primary flex h-full flex-col items-center justify-center">
                <div className="bg-primary/10 mb-3 rounded-full p-4 transition-transform group-hover:scale-110">
                    <Plus className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">Thêm bàn mới</span>
            </div>
        </div>
    )
}

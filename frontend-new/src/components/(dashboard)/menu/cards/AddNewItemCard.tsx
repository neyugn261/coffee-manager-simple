'use client'

import { Plus } from 'lucide-react'

interface AddNewItemCardProps {
    onClick: () => void
}

export default function AddNewItemCard({ onClick }: AddNewItemCardProps) {
    return (
        <div
            onClick={onClick}
            className="group border-primary/30 from-primary/5 to-accent/5 hover:border-primary/50 relative aspect-square h-full w-full cursor-pointer rounded-2xl border-2 border-dashed bg-gradient-to-br p-6 transition-all duration-200 select-none hover:shadow-lg"
        >
            <div className="text-primary flex h-full flex-col items-center justify-center">
                <div className="bg-primary/10 mb-3 rounded-full p-4 transition-transform group-hover:scale-110">
                    <Plus className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">Thêm món</span>
            </div>
        </div>
    )
}

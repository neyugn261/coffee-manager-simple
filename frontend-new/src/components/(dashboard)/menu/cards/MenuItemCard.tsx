'use client'

import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { MenuItem } from '@/lib/types'
import Image from 'next/image'

interface MenuItemCardProps {
    item: MenuItem
    onEdit: (item: MenuItem) => void
    onDelete: (id: number) => void
    getCategoryLabel: (categoryValue: string) => string
    formatPrice: (price: number) => string
}

export default function MenuItemCard({
    item,
    onEdit,
    onDelete,
    getCategoryLabel,
    formatPrice,
}: MenuItemCardProps) {
    return (
        <div className="group bg-card border-border relative overflow-hidden rounded-2xl border shadow-md transition-all duration-200 hover:shadow-xl">
            {/* Image */}
            <div className="bg-muted aspect-square overflow-hidden">
                {item.image_url ? (
                    <Image
                        width={250}
                        height={250}
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center select-none">
                        <div className="text-center">
                            <div className="text-3xl">
                                {getCategoryLabel(item.category).split(' ')[0]}
                            </div>
                            <div className="text-xs">Chưa có ảnh</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-foreground line-clamp-1 font-semibold">{item.name}</h3>
                    <span className="text-primary text-sm font-bold">
                        {formatPrice(item.price)}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="flex-1"
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="text-destructive hover:bg-destructive flex-1"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

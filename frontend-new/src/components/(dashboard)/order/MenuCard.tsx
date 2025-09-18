'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MenuItem } from '@/lib/types'
import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'

type Props = {
    item: MenuItem & { image?: string; categoryLabel?: string }
    onAdd?: (it: MenuItem, qty?: number) => void
}

export default function MenuCard({ item, onAdd }: Props) {
    const [qty, setQty] = useState(0)

    const handleAdd = () => {
        const newQty = qty + 1
        setQty(newQty)
        onAdd?.(item, 1)
    }

    const handleRemove = () => {
        if (qty <= 0) return
        const newQty = qty - 1
        setQty(newQty)
        onAdd?.(item, -1)
    }

    return (
        <Card className="border-border bg-card text-foreground overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-lg">
            {/* Banner */}
            <div className="bg-secondary relative aspect-[16/9] w-full overflow-hidden">
                {item.image && (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(min-width:1024px) 25vw,(min-width:640px) 50vw,100vw"
                    />
                )}
            </div>

            <CardContent className="space-y-4 p-4">
                {/* Tên + Giá */}
                <div className="flex items-start justify-between">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-accent shrink-0 font-semibold">
                        {item.price.toLocaleString('vi-VN')}{' '}
                        <span className="text-muted-foreground">đ</span>
                    </div>
                </div>

                {/* Nhãn loại */}
                <div>
                    <span className="bg-accent/15 text-accent ring-accent/30 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset">
                        <span className="bg-accent h-2 w-2 rounded-full shadow-[0_0_0_2px_var(--accent-shadow)]" />
                        {item.categoryLabel ??
                            ([
                                'coffee',
                                'latte',
                                'milkTea',
                                'soda',
                                'fruitTea',
                                'yaourt',
                                'milo-cacao',
                                'juice',
                                'bottleDrink',
                            ].includes(item.category)
                                ? 'Đồ uống'
                                : 'Đồ ăn')}
                    </span>
                </div>

                {/* Nút Thêm hoặc Counter */}
                <div className="pt-1">
                    {qty === 0 ? (
                        <Button
                            className="bg-accent text-foreground mx-auto flex w-44 cursor-pointer items-center justify-center gap-2 rounded-xl shadow-[0_8px_24px_var(--accent-shadow)] hover:bg-[var(--accent-hover)]"
                            onClick={handleAdd}
                        >
                            + Thêm
                        </Button>
                    ) : (
                        <div className="border-accent bg-accent/10 mx-auto flex w-44 items-center justify-between rounded-xl border px-2 py-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-accent text-accent-foreground h-8 w-8 cursor-pointer rounded-full hover:bg-[var(--accent-hover)]"
                                onClick={handleRemove}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium">{qty}</span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-accent text-accent-foreground h-8 w-8 cursor-pointer rounded-full hover:bg-[var(--accent-hover)]"
                                onClick={handleAdd}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

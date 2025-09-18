// src/components/order/SearchFilter.tsx
'use client'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { Category } from '@/lib/types'

export default function SearchFilter({
    search,
    setSearch,
    category,
    setCategory,
}: {
    search: string
    setSearch: (v: string) => void
    category: Category
    setCategory: (v: Category) => void
}) {
    return (
        <div className="flex w-full flex-col gap-3 sm:flex-row">
            <div className="flex-1">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Tìm kiếm món ăn..."
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-xl border-2 px-4 text-base transition-all focus:ring-2"
                />
            </div>
            <div className="min-w-[160px] sm:min-w-[180px]">
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger className="bg-card border-border text-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-xl border-2 px-4 text-base transition-all focus:ring-2">
                        <SelectValue placeholder="📂 Loại món" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground rounded-xl border shadow-lg">
                        <SelectItem
                            value="all"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🍽️ Tất cả
                        </SelectItem>
                        <SelectItem
                            value="coffee"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            ☕ Cà phê
                        </SelectItem>
                        <SelectItem
                            value="latte"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🥛 Latte
                        </SelectItem>
                        <SelectItem
                            value="milkTea"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🧋 Trà sữa
                        </SelectItem>
                        <SelectItem
                            value="soda"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🥤 Soda
                        </SelectItem>
                        <SelectItem
                            value="juice"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🧃 Nước ép
                        </SelectItem>
                        <SelectItem
                            value="food"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🍕 Đồ ăn
                        </SelectItem>
                        <SelectItem
                            value="other"
                            className="hover:bg-primary/10 rounded-lg px-3 py-2"
                        >
                            🍽️ Khác
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

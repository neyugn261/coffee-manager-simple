'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ImageIcon, DollarSign, Tag, Type, CirclePlus } from 'lucide-react'
import type { MenuItem } from '@/lib/types'
import Image from 'next/image'

interface MenuAddEditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingItem: MenuItem | null
    formData: {
        name: string
        price: string
        category: string
        image_url: string
    }
    setFormData: React.Dispatch<
        React.SetStateAction<{
            name: string
            price: string
            category: string
            image_url: string
        }>
    >
    onSubmit: (e: React.FormEvent) => void
    onReset: () => void
    menuCategories: Array<{ value: string; label: string }>
}

export default function MenuAddEditModal({
    open,
    onOpenChange,
    editingItem,
    formData,
    setFormData,
    onSubmit,
    onReset,
    menuCategories,
}: MenuAddEditModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-popover border-border overflow-hidden rounded-2xl shadow-2xl sm:max-w-lg">
                <DialogHeader className="border-border/50 border-b pb-6 select-none">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-xl p-2">
                            {editingItem ? (
                                <Tag className="text-primary h-5 w-5" />
                            ) : (
                                <CirclePlus className="text-primary h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-popover-foreground text-xl font-semibold">
                                {editingItem ? 'Chỉnh sửa món' : 'Thêm món mới'}
                            </DialogTitle>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {editingItem
                                    ? 'Cập nhật thông tin món ăn'
                                    : 'Tạo món ăn mới cho menu'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 pt-2">
                    {/* Tên món */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 select-none">
                            <Type className="text-muted-foreground h-4 w-4" />
                            <label className="text-popover-foreground text-sm font-medium">
                                Tên món
                            </label>
                            <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                                Bắt buộc
                            </Badge>
                        </div>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Nhập tên món..."
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 h-11 rounded-xl transition-all duration-200 focus:ring-2"
                        />
                    </div>

                    {/* Giá và Loại - Grid layout */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Giá */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 select-none">
                                <DollarSign className="text-muted-foreground h-4 w-4" />
                                <label className="text-popover-foreground text-sm font-medium">
                                    Giá
                                </label>
                                <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                                    Bắt buộc
                                </Badge>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, price: e.target.value }))
                                    }
                                    placeholder="0"
                                    min="0"
                                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 h-11 rounded-xl pr-12 transition-all duration-200 focus:ring-2"
                                />
                                <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                                    VNĐ
                                </span>
                            </div>
                        </div>

                        {/* Loại */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 select-none">
                                <Tag className="text-muted-foreground h-4 w-4" />
                                <label className="text-popover-foreground text-sm font-medium">
                                    Loại
                                </label>
                                <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                                    Bắt buộc
                                </Badge>
                            </div>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, category: value }))
                                }
                            >
                                <SelectTrigger className="bg-input border-border text-foreground focus:ring-primary/20 h-11 rounded-xl transition-all duration-200 focus:ring-2">
                                    <SelectValue placeholder="Chọn loại món" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border rounded-xl shadow-lg">
                                    {menuCategories.map((category) => (
                                        <SelectItem
                                            key={category.value}
                                            value={category.value}
                                            className="text-popover-foreground hover:bg-accent hover:text-accent-foreground mx-1 rounded-lg"
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 select-none">
                            <ImageIcon className="text-muted-foreground h-4 w-4" />
                            <label className="text-popover-foreground text-sm font-medium">
                                Hình ảnh
                            </label>
                            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                Tùy chọn
                            </Badge>
                        </div>
                        <Input
                            type="url"
                            value={formData.image_url || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, image_url: e.target.value }))
                            }
                            placeholder="https://example.com/image.jpg"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 h-11 rounded-xl transition-all duration-200 focus:ring-2"
                        />
                        {formData.image_url && (
                            <div className="bg-muted/30 border-border/50 mt-3 rounded-xl border p-3">
                                <p className="text-muted-foreground mb-2 text-xs">Xem trước:</p>
                                <div className="bg-muted h-20 w-20 overflow-hidden rounded-lg">
                                    <Image
                                        src={formData.image_url}
                                        width={80}
                                        height={80}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-border/50 flex gap-3 border-t pt-6 select-none">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="border-border hover:bg-muted/50 h-11 flex-1 rounded-xl transition-all duration-200"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 h-11 flex-1 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                            {editingItem ? 'Cập nhật món' : 'Thêm món mới'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

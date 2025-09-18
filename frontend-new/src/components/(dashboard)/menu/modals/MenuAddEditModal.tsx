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
import type { MenuItem } from '@/lib/types'

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
            <DialogContent className="bg-popover border-border shadow-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-popover-foreground">
                        {editingItem ? 'Chỉnh sửa món' : 'Thêm món mới'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-popover-foreground text-sm font-medium">
                            Tên món <span className="text-red-500">*</span>
                        </label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Nhập tên món..."
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div>
                        <label className="text-popover-foreground text-sm font-medium">
                            Giá <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, price: e.target.value }))
                            }
                            placeholder="0"
                            min="0"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div>
                        <label className="text-popover-foreground text-sm font-medium">
                            Image URL
                        </label>
                        <Input
                            type="text"
                            value={formData.image_url || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, image_url: e.target.value }))
                            }
                            placeholder="Nhập URL ảnh..."
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div>
                        <label className="text-popover-foreground text-sm font-medium">
                            Loại *
                        </label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, category: value }))
                            }
                        >
                            <SelectTrigger className="bg-input border-border text-foreground">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {menuCategories.map((category) => (
                                    <SelectItem
                                        key={category.value}
                                        value={category.value}
                                        className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                        >
                            {editingItem ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

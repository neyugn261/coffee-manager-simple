'use client'

import { useState, useEffect } from 'react'
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
import { Plus, Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import apiService from '@/services/apiService'
import type { MenuItem } from '@/lib/types'

// Định nghĩa các loại món cố định
const MENU_CATEGORIES = [
    { value: 'yaourt', label: '🍦 Yaourt' },
    { value: 'milkTea', label: '🧋 Trà sữa' },
    { value: 'soda', label: '🥤 Nước ngọt' },
    { value: 'fruitTea', label: '🍑 Trà trái cây' },
    { value: 'topping', label: '🍡 Topping' },
    { value: 'latte', label: '🥛 Latte' },
    { value: 'food', label: '🍟 Ăn vặt' },
    { value: 'coffee', label: '☕ Cà phê' },
    { value: 'milo-cacao', label: '🍫 Milo/Cacao' },
    { value: 'juice', label: '🍊 Nước ép' },
    { value: 'bottleDrink', label: '🍼 Nước chai' },
    { value: 'other', label: '✨ Khác' },
]

// Using MenuItem from types.ts

export default function MenuManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12 // 12 items mỗi trang (không tính card thêm mới)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'other',
        image_url: '',
    })

    // Load menu items (mock data for now)
    useEffect(() => {
        loadMenuItems()
    }, [])

    const loadMenuItems = async () => {
        try {
            const data = await apiService.menu.getAll()
            console.log('Menu items from API:', data)
            setMenuItems(data)
        } catch (error) {
            console.error('Error loading menu items:', error)
        } finally {
            setLoading(false)
        }
    }

    // Filter items
    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredItems.slice(startIndex, endIndex)

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedCategory])

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingItem) {
                const updatedItem = await apiService.menu.update(editingItem.id, {
                    name: formData.name,
                    price: parseInt(formData.price),
                    category: formData.category as
                        | 'yaourt'
                        | 'milkTea'
                        | 'soda'
                        | 'fruitTea'
                        | 'topping'
                        | 'latte'
                        | 'food'
                        | 'coffee'
                        | 'milo-cacao'
                        | 'juice'
                        | 'bottleDrink'
                        | 'other',
                    image_url: formData.image_url || undefined,
                })
                setMenuItems((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? updatedItem : item)),
                )
            } else {
                const created = await apiService.menu.create({
                    name: formData.name,
                    price: parseInt(formData.price),
                    category: formData.category as
                        | 'yaourt'
                        | 'milkTea'
                        | 'soda'
                        | 'fruitTea'
                        | 'topping'
                        | 'latte'
                        | 'food'
                        | 'coffee'
                        | 'milo-cacao'
                        | 'juice'
                        | 'bottleDrink'
                        | 'other',
                    image_url: formData.image_url || undefined,
                })
                setMenuItems((prev) => [...prev, created])
            }

            resetForm()
        } catch (error) {
            console.error('Error saving item:', error)
        }
    }

    const resetForm = () => {
        setFormData({ name: '', price: '', category: 'other', image_url: '' })
        setShowAddModal(false)
        setEditingItem(null)
    }

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            price: item.price.toString(),
            category: item.category,
            image_url: item.image_url || '',
        })
        setShowAddModal(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa món này?')) {
            try {
                await apiService.menu.delete(id)
                setMenuItems((prev) => prev.filter((item) => item.id !== id))
            } catch (error) {
                console.error('Error deleting item:', error)
            }
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)
    }

    const getCategoryLabel = (categoryValue: string) => {
        const category = MENU_CATEGORIES.find((cat) => cat.value === categoryValue)
        return category ? category.label : '✨ Khác'
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm món..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Category Filter - Desktop */}
                <div className="hidden sm:block">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">📋 Tất cả</SelectItem>
                            {MENU_CATEGORIES.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Mobile Category Filter */}
                <div className="sm:hidden">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-10 w-12 justify-center p-0">
                            <Filter className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">📋 Tất cả</SelectItem>
                            {MENU_CATEGORIES.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {/* Add New Item Card */}
                <div
                    onClick={() => setShowAddModal(true)}
                    className="group border-primary/30 from-primary/5 to-accent/5 hover:border-primary/50 relative aspect-square cursor-pointer rounded-2xl border-2 border-dashed bg-gradient-to-br p-6 transition-all duration-200 hover:shadow-lg"
                >
                    <div className="text-primary flex h-full flex-col items-center justify-center">
                        <div className="bg-primary/10 mb-3 rounded-full p-4 transition-transform group-hover:scale-110">
                            <Plus className="h-8 w-8" />
                        </div>
                        <span className="text-sm font-medium">Thêm món</span>
                    </div>
                </div>

                {/* Menu Item Cards */}
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-card border-border relative overflow-hidden rounded-2xl border shadow-md transition-all duration-200 hover:shadow-xl"
                    >
                        {/* Image */}
                        <div className="bg-muted aspect-square overflow-hidden">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-muted-foreground flex h-full items-center justify-center">
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
                                <h3 className="text-foreground line-clamp-1 font-semibold">
                                    {item.name}
                                </h3>
                                <span className="text-primary text-sm font-bold">
                                    {formatPrice(item.price)}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    className="flex-1"
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                    className="text-destructive hover:bg-destructive/10 flex-1"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                    </Button>

                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <span className="text-muted-foreground text-sm">
                            ({filteredItems.length} món)
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2"
                    >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Dialog open={showAddModal} onOpenChange={resetForm}>
                <DialogContent className="bg-popover border-border shadow-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-popover-foreground">
                            {editingItem ? 'Chỉnh sửa món' : 'Thêm món mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-popover-foreground text-sm font-medium">
                                Tên món *
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
                                Giá *
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
                                    {MENU_CATEGORIES.map((category) => (
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
                                onClick={resetForm}
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
        </div>
    )
}

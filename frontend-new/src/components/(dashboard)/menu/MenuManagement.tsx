'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import apiService from '@/services/apiService'
import type { MenuItem } from '@/lib/types'
import MenuItemCard from './cards/MenuItemCard'
import AddNewItemCard from './cards/AddNewItemCard'
import MenuAddEditModal from './modals/MenuAddEditModal'

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
                <AddNewItemCard onClick={() => setShowAddModal(true)} />

                {/* Menu Item Cards */}
                {filteredItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getCategoryLabel={getCategoryLabel}
                        formatPrice={formatPrice}
                    />
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
            <MenuAddEditModal
                open={showAddModal}
                onOpenChange={resetForm}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onReset={resetForm}
                menuCategories={MENU_CATEGORIES}
            />
        </div>
    )
}

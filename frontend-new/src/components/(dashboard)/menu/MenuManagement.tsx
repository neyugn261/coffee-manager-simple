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
import ReLoadButton from './cards/ReloadButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll } from '@fortawesome/free-solid-svg-icons'

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        setLoading(true)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-card/50 border-border/50 rounded-2xl border p-6 shadow-lg backdrop-blur-sm select-none">
                <div className="mb-6 flex items-center gap-4">
                    <div className="bg-primary/10 rounded-xl p-3">
                        <Search className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-foreground text-xl font-semibold">Tìm kiếm & Lọc</h2>
                        <p className="text-muted-foreground text-sm">
                            Tìm kiếm món ăn và lọc theo danh mục
                        </p>
                    </div>
                    <ReLoadButton fn={loadMenuItems} />
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                    {/* Search Box */}
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Tìm kiếm món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 h-[36px] rounded-xl pl-12 transition-all duration-200 focus:ring-2"
                        />
                    </div>

                    {/* Category Filter - Desktop */}
                    <div className="hidden w-30 sm:block">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="bg-input border-border text-foreground focus:ring-primary/20 w-full rounded-xl transition-all duration-200 focus:ring-2">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl shadow-lg">
                                <SelectItem
                                    value="all"
                                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <FontAwesomeIcon icon={faBorderAll} className="h-6 w-6" />
                                        <span>Tất cả</span>
                                    </div>
                                </SelectItem>
                                {MENU_CATEGORIES.map((category) => (
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

                    {/* Mobile Category Filter */}
                    <div className="sm:hidden">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="bg-input border-border text-foreground focus:ring-primary/20 h-12 rounded-xl transition-all duration-200 focus:ring-2">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Lọc danh mục" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl shadow-lg">
                                <SelectItem
                                    value="all"
                                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground mx-1 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faBorderAll} className="h-4 w-4" />
                                        <span>Tất cả</span>
                                    </div>
                                </SelectItem>
                                {MENU_CATEGORIES.map((category) => (
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

                {/* Results Summary */}
                {/* <div className="border-border/50 mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Hiển thị {filteredItems.length} món
                            {selectedCategory !== 'all' && (
                                <span className="ml-1">
                                    trong danh mục
                                    {
                                        MENU_CATEGORIES.find(
                                            (cat) => cat.value === selectedCategory,
                                        )?.label
                                    }
                                    &quot;
                                </span>
                            )}
                        </span>
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm('')}
                                className="text-muted-foreground hover:text-foreground h-8 rounded-lg px-3"
                            >
                                Xóa tìm kiếm
                            </Button>
                        )}
                    </div>
                </div> */}
            </div>

            {/* Menu Items Grid */}
            <div className="bg-card/30 border-border/50 rounded-2xl border p-6 shadow-lg backdrop-blur-sm">
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

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <Search className="text-muted-foreground h-8 w-8" />
                        </div>
                        <h3 className="text-foreground mb-2 text-lg font-medium">
                            Không tìm thấy món nào
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            {searchTerm
                                ? `Không có món nào khớp với "${searchTerm}"`
                                : 'Không có món nào trong danh mục này'}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategory('all')
                            }}
                            className="rounded-xl"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-card/50 border-border/50 rounded-2xl border p-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-border hover:bg-muted/50 flex h-10 items-center gap-2 rounded-xl transition-all duration-200"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trang trước
                        </Button>

                        <div className="bg-muted/30 flex items-center gap-3 rounded-xl px-4 py-2">
                            <span className="text-foreground text-sm font-medium">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <div className="bg-border h-4 w-px"></div>
                            <span className="text-muted-foreground text-sm">
                                {filteredItems.length} món
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border-border hover:bg-muted/50 flex h-10 items-center gap-2 rounded-xl transition-all duration-200"
                        >
                            Trang sau
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
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

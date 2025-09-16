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
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'

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

interface MenuItem {
    id: string
    name: string
    price: number
    category: string
    image?: string
}

export default function MenuManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [showMobileFilter, setShowMobileFilter] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'other',
    })

    // Load menu items (mock data for now)
    useEffect(() => {
        loadMenuItems()
    }, [])

    const loadMenuItems = async () => {
        setLoading(true)
        try {
            // Simulate API call - replace with actual API
            const mockData: MenuItem[] = [
                {
                    id: '1',
                    name: 'Trà sữa truyền thống',
                    price: 25000,
                    category: 'milkTea',
                    image: '/api/placeholder/150/150',
                },
                {
                    id: '2',
                    name: 'Cà phê đen',
                    price: 20000,
                    category: 'coffee',
                    image: '/api/placeholder/150/150',
                },
                {
                    id: '3',
                    name: 'Yaourt dâu',
                    price: 30000,
                    category: 'yaourt',
                    image: '/api/placeholder/150/150',
                },
                { id: '4', name: 'Nước ép cam', price: 35000, category: 'juice' },
                { id: '5', name: 'Bánh mì thịt', price: 25000, category: 'food' },
            ]
            setMenuItems(mockData)
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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const newItem: MenuItem = {
                id: editingItem?.id || Date.now().toString(),
                name: formData.name,
                price: parseInt(formData.price),
                category: formData.category,
            }

            if (editingItem) {
                setMenuItems((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? newItem : item)),
                )
            } else {
                setMenuItems((prev) => [...prev, newItem])
            }

            resetForm()
        } catch (error) {
            console.error('Error saving item:', error)
        }
    }

    const resetForm = () => {
        setFormData({ name: '', price: '', category: 'other' })
        setShowAddModal(false)
        setEditingItem(null)
    }

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            price: item.price.toString(),
            category: item.category,
        })
        setShowAddModal(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa món này?')) {
            setMenuItems((prev) => prev.filter((item) => item.id !== id))
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search Box */}
                <div className="relative max-w-md flex-1">
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

                {/* Mobile Filter Button */}
                <Button
                    variant="outline"
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                    className="sm:hidden"
                >
                    <Filter className="h-4 w-4" />
                    Lọc
                </Button>
            </div>

            {/* Mobile Filter Dropdown */}
            {showMobileFilter && (
                <div className="sm:hidden">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
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
            )}

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
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-foreground line-clamp-1 font-semibold">
                                    {item.name}
                                </h3>
                                <span className="text-primary text-sm font-bold">
                                    {formatPrice(item.price)}
                                </span>
                            </div>

                            <div className="text-muted-foreground mb-3 text-xs">
                                {getCategoryLabel(item.category)}
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

            {/* Add/Edit Modal */}
            <Dialog open={showAddModal} onOpenChange={resetForm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Chỉnh sửa món' : 'Thêm món mới'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Tên món *</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                                }
                                placeholder="Nhập tên món..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Giá *</label>
                            <Input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                                }
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Loại *</label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, category: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MENU_CATEGORIES.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
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
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                            <Button type="submit" className="flex-1">
                                {editingItem ? 'Cập nhật' : 'Thêm'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

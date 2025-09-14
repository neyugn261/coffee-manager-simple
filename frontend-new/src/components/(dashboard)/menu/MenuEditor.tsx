'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useMenu } from '@/store'
import type { Category, MenuItem } from '@/lib/types'
import { getCategoryInfo, getFormCategories, getStatsCategories } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table as UTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { CirclePlus, List, Pencil, Trash2 } from 'lucide-react'

interface FormData {
    name: string
    price: number
    category: Category
}

const INITIAL_FORM: FormData = { name: '', price: 0, category: 'drink' }

export default function MenuEditor() {
    const { state, actions } = useMenu()
    const { items: menu, loading, error } = state
    const { fetchItems, createItem, updateItem, deleteItem, clearError } = actions

    const [form, setForm] = useState<FormData>(INITIAL_FORM)
    const [editing, setEditing] = useState<MenuItem | null>(null)

    // Memoized values
    const isFormValid = useMemo(
        () => form.name.trim().length > 0 && form.price > 0,
        [form.name, form.price],
    )

    const menuCount = useMemo(() => menu.length, [menu.length])

    const categoryStats = useMemo(() => {
        const stats = menu.reduce(
            (acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1
                return acc
            },
            {} as Record<Category, number>,
        )
        return stats
    }, [menu])

    // Load menu data on component mount
    useEffect(() => {
        if (menu.length === 0) {
            fetchItems()
        }
    }, [fetchItems, menu.length])

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    // Callbacks
    const handleInputChange = useCallback(
        (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = field === 'price' ? Number(e.target.value) : e.target.value
            setForm((prev) => ({ ...prev, [field]: value }))
        },
        [],
    )

    const handleCategoryChange = useCallback((value: string) => {
        setForm((prev) => ({ ...prev, category: value as Category }))
    }, [])

    const submit = useCallback(async () => {
        if (!isFormValid) return

        try {
            if (editing) {
                await updateItem(editing.id, form)
                setEditing(null)
            } else {
                await createItem(form)
            }
            setForm(INITIAL_FORM)
        } catch (err) {
            console.error('Submit error:', err)
        }
    }, [editing, form, isFormValid, updateItem, createItem])

    const handleEdit = useCallback((menuItem: MenuItem) => {
        setEditing(menuItem)
        setForm({
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category,
        })
    }, [])

    const handleCancel = useCallback(() => {
        setEditing(null)
        setForm(INITIAL_FORM)
    }, [])

    const handleDelete = useCallback(
        async (id: string) => {
            if (window.confirm('Bạn có chắc muốn xoá món này?')) {
                await deleteItem(id)
            }
        },
        [deleteItem],
    )

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && isFormValid) {
                e.preventDefault()
                submit()
            }
        },
        [submit, isFormValid],
    )

    if (loading && menu.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    <span className="text-muted-foreground text-sm">Đang tải menu...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="select-nonexl:items-stretch flex h-[calc(100vh-180px)] min-h-[600px] flex-col gap-4 *:p-6 lg:gap-6 xl:flex-row">
            {error && (
                <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 max-w-md">
                    <div className="bg-card rounded-lg border p-4 shadow-lg">
                        <div className="flex items-center justify-evenly gap-3">
                            <div className="bg-destructive flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                <span className="text-foreground text-sm font-medium">!</span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-row items-center">
                                <p className="text-foreground align-middle text-sm font-medium">
                                    Có lỗi xảy ra
                                </p>
                                <p className="text-foreground mt-1 text-sm">{error}</p>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-foreground flex-shrink-0 transition-colors hover:text-red-600"
                            >
                                <span className="sr-only">Đóng</span>
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <Card className="h-fit xl:w-1/3 xl:flex-shrink-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <span className="text-2xl">{editing ? <Pencil /> : <CirclePlus />}</span>
                        {editing ? 'Sửa món' : 'Thêm món'}
                    </CardTitle>
                    {editing && (
                        <p className="text-muted-foreground text-sm">
                            Đang chỉnh sửa: <span className="font-medium">{editing.name}</span>
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Input
                            placeholder="Tên món"
                            value={form.name}
                            onChange={handleInputChange('name')}
                            onKeyDown={handleKeyPress}
                            className="text-base sm:text-sm"
                            maxLength={100}
                        />
                        <div className="text-muted-foreground mt-1 text-xs">
                            {form.name.length}/100 ký tự
                        </div>
                    </div>

                    <div>
                        <Input
                            type="number"
                            placeholder="Giá (VNĐ)"
                            value={form.price || ''}
                            onChange={handleInputChange('price')}
                            onKeyDown={handleKeyPress}
                            className="text-base sm:text-sm"
                            min="0"
                            step="1000"
                        />
                        <div className="text-muted-foreground mt-1 text-xs">
                            {form.price > 0 && `${form.price.toLocaleString()}đ`}
                        </div>
                    </div>

                    <Select value={form.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            {getFormCategories().map(([key, config]) => (
                                <SelectItem key={key} value={key} className="cursor-pointer">
                                    {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex flex-col gap-2 *:h-10 sm:flex-row">
                        <Button
                            onClick={submit}
                            className="w-full sm:w-auto"
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                    Đang xử lý...
                                </div>
                            ) : editing ? (
                                'Cập nhật'
                            ) : (
                                'Thêm món'
                            )}
                        </Button>
                        {editing && (
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                className="w-full sm:w-auto"
                                disabled={loading}
                            >
                                Huỷ
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* List Card */}
            <Card className="flex h-[400px] flex-1 flex-col xl:w-2/3">
                <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <List /> Danh sách món
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {getStatsCategories().map(([key, config]) => (
                                <span
                                    key={key}
                                    className={`rounded-full px-2 py-1 ${config.color}`}
                                >
                                    {config.label}: {categoryStats[key as Category] || 0}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                    <div className="flex h-fit min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
                        {/* Fixed Header */}
                        <div className="bg-muted/20 flex-shrink-0 border-b px-2">
                            <UTable>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="h-12 font-semibold">
                                            Tên món
                                        </TableHead>
                                        <TableHead className="h-12 w-20 font-semibold">
                                            Loại
                                        </TableHead>
                                        <TableHead className="h-12 w-28 text-right font-semibold">
                                            Giá
                                        </TableHead>
                                        <TableHead className="h-12 w-45 text-center font-semibold">
                                            Thao tác
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                            </UTable>
                        </div>

                        {/* Scrollable Body */}
                        <div className="scrollable-area overflow-y-auto">
                            <UTable>
                                <TableBody>
                                    {menu.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className={`hover:bg-muted/30 group transition-colors ${editing?.id === item.id ? 'text-destructive dark:text-destructive dark:bg-primary/20 text-xs' : ''}`}
                                        >
                                            <TableCell className={`py-3 font-medium`}>
                                                <div className="flex items-center gap-2">
                                                    <span>{item.name}</span>
                                                </div>
                                            </TableCell>
                                            {/* Category */}
                                            <TableCell className="text-muted-foreground py-3 text-right text-sm">
                                                {getCategoryInfo(item.category).label}
                                            </TableCell>
                                            {/* Price */}
                                            <TableCell className="py-3 text-right font-mono font-medium">
                                                {item.price.toLocaleString()}
                                            </TableCell>
                                            {/* Action */}
                                            <TableCell className="py-3">
                                                <div className="flex justify-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(item)}
                                                        className="h-7 px-2 text-xs"
                                                        disabled={loading}
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="h-7 px-2 text-xs"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </UTable>

                            {menu.length === 0 && (
                                <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
                                    <div className="mb-2 text-lg font-medium">Menu trống</div>
                                    <div className="text-sm">Thêm món đầu tiên để bắt đầu</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="text-muted-foreground mt-4 flex flex-shrink-0 items-center justify-center gap-4 text-sm">
                        <span className="bg-secondary/20 rounded-full px-3 py-1.5 font-medium">
                            Tổng cộng: {menuCount} món
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

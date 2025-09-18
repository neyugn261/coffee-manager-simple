'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2 } from 'lucide-react'
import apiService from '@/services/apiService'
import type { Table } from '@/lib/types'

export default function TableManagement() {
    const [tables, setTables] = useState<Table[]>([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingTable, setEditingTable] = useState<Table | null>(null)
    const [loading, setLoading] = useState(false)

    // Form state
    const [tableName, setTableName] = useState('')

    // Load tables (mock data for now)
    useEffect(() => {
        loadTables()
    }, [])

    const loadTables = async () => {
        setLoading(true)
        try {
            const data = await apiService.table.getAll()
            setTables(data)
        } catch (error) {
            console.error('Error loading tables:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tableName.trim()) return

        try {
            if (editingTable) {
                const updatedTable = await apiService.table.update(editingTable.id, {
                    table_name: tableName.trim(),
                })
                setTables((prev) =>
                    prev.map((table) => (table.id === editingTable.id ? updatedTable : table)),
                )
            } else {
                const created = await apiService.table.create({
                    table_name: tableName.trim(),
                })
                setTables((prev) => [...prev, created])
            }

            resetForm()
        } catch (error) {
            console.error('Error saving table:', error)
        }
    }

    const resetForm = () => {
        setTableName('')
        setShowAddModal(false)
        setEditingTable(null)
    }

    const handleEdit = (table: Table) => {
        setEditingTable(table)
        setTableName(table.table_name)
        setShowAddModal(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa bàn này?')) {
            try {
                await apiService.table.delete(id)
                setTables((prev) => prev.filter((table) => table.id !== id))
            } catch (error) {
                console.error('Error deleting table:', error)
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-foreground text-xl font-semibold">Danh sách bàn</h2>
                    <p className="text-muted-foreground text-sm">
                        Quản lý các bàn trong quán của bạn
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm bàn
                </Button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className="group bg-card border-border relative overflow-hidden rounded-2xl border p-6 shadow-md transition-all duration-200 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                                    🪑
                                </div>
                                <div>
                                    <h3 className="text-foreground font-semibold">
                                        {table.table_name}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">Trống</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(table)}
                                className="flex-1"
                            >
                                <Edit className="mr-1 h-3 w-3" />
                                Sửa
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(table.id)}
                                className="text-destructive hover:bg-destructive/10 flex-1"
                            >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Xóa
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Add New Table Card */}
                <div
                    onClick={() => setShowAddModal(true)}
                    className="group border-primary/30 from-primary/5 to-accent/5 hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed bg-gradient-to-br p-6 transition-all duration-200 hover:shadow-lg"
                >
                    <div className="text-primary flex h-full flex-col items-center justify-center">
                        <div className="bg-primary/10 mb-3 rounded-full p-4 transition-transform group-hover:scale-110">
                            <Plus className="h-8 w-8" />
                        </div>
                        <span className="text-sm font-medium">Thêm bàn mới</span>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={showAddModal} onOpenChange={resetForm}>
                <DialogContent className="bg-popover border-border shadow-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-popover-foreground">
                            {editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-popover-foreground text-sm font-medium">
                                Tên bàn *
                            </label>
                            <Input
                                required
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                placeholder="Nhập tên bàn..."
                                autoFocus
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
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
                                {editingTable ? 'Cập nhật' : 'Thêm'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

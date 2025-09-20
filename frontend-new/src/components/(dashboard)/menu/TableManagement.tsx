'use client'

import { useState, useEffect } from 'react'
import apiService from '@/services/apiService'
import type { Table } from '@/lib/types'
import TableCard from './cards/TableCard'
import AddNewTableCard from './cards/AddNewTableCard'
import TableAddEditModal from './modals/TableAddEditModal'
import ReLoadButton from '@/components/(dashboard)/menu/cards/ReloadButton'

export default function TableManagement() {
    const [tables, setTables] = useState<Table[]>([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingTable, setEditingTable] = useState<Table | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-card/50 border-border/50 rounded-2xl border p-6 shadow-lg backdrop-blur-sm select-none">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-xl p-3">
                        <svg
                            className="text-primary h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8V6a2 2 0 012-2h14a2 2 0 012 2v4M5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-foreground text-xl font-semibold">Quản lý bàn ăn</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Quản lý và theo dõi tất cả bàn ăn trong nhà hàng
                        </p>
                    </div>

                    <div className="hidden items-center gap-4 text-sm lg:flex">
                        <div className="bg-muted/30 rounded-xl px-4 py-2">
                            <span className="text-muted-foreground">Tổng số bàn:</span>
                            <span className="text-foreground ml-2 font-medium">
                                {tables.length}
                            </span>
                        </div>
                        <div className="rounded-xl bg-green-500/10 px-4 py-2">
                            <span className="text-muted-foreground">Bàn trống:</span>
                            <span className="ml-2 font-medium text-green-600">
                                {tables.filter((table) => table.status === 'empty').length}
                            </span>
                        </div>
                        <div className="rounded-xl bg-orange-500/10 px-4 py-2">
                            <span className="text-muted-foreground">Đang sử dụng:</span>
                            <span className="ml-2 font-medium text-orange-600">
                                {tables.filter((table) => table.status === 'occupied').length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Stats */}
                <div className="border-border/50 mt-4 border-t pt-4 lg:hidden">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-muted/30 rounded-xl px-3 py-2 text-center">
                            <div className="text-foreground text-lg font-medium">
                                {tables.length}
                            </div>
                            <div className="text-muted-foreground text-xs">Tổng bàn</div>
                        </div>
                        <div className="rounded-xl bg-green-500/10 px-3 py-2 text-center">
                            <div className="text-lg font-medium text-green-600">
                                {tables.filter((table) => table.status === 'empty').length}
                            </div>
                            <div className="text-muted-foreground text-xs">Trống</div>
                        </div>
                        <div className="rounded-xl bg-orange-500/10 px-3 py-2 text-center">
                            <div className="text-lg font-medium text-orange-600">
                                {tables.filter((table) => table.status === 'occupied').length}
                            </div>
                            <div className="text-muted-foreground text-xs">Đang dùng</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="bg-card/30 border-border/50 rounded-2xl border p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="text-foreground text-lg font-medium">Danh sách bàn ăn</div>

                        <p className="text-muted-foreground text-sm">
                            Nhấn vào bàn để chỉnh sửa hoặc xem chi tiết
                        </p>
                    </div>
                    <div className="flex w-fit flex-row items-center justify-end pt-2">
                        <ReLoadButton fn={loadTables} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Add New Table Card */}
                    <AddNewTableCard onClick={() => setShowAddModal(true)} />

                    {/* Table Cards */}
                    {tables.map((table) => (
                        <TableCard
                            key={table.id}
                            table={table}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {tables.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <svg
                                className="text-muted-foreground h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8V6a2 2 0 012-2h14a2 2 0 012 2v4M5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8"
                                />
                            </svg>
                        </div>
                        <h3 className="text-foreground mb-2 text-lg font-medium">
                            Chưa có bàn nào
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Bắt đầu bằng cách thêm bàn đầu tiên cho nhà hàng của bạn
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                            Thêm bàn đầu tiên
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <TableAddEditModal
                open={showAddModal}
                onOpenChange={resetForm}
                editingTable={editingTable}
                tableName={tableName}
                setTableName={setTableName}
                onSubmit={handleSubmit}
                onReset={resetForm}
            />
        </div>
    )
}

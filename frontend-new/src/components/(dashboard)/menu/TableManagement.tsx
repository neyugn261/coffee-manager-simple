'use client'

import { useState, useEffect } from 'react'
import apiService from '@/services/apiService'
import type { Table } from '@/lib/types'
import TableCard from './cards/TableCard'
import AddNewTableCard from './cards/AddNewTableCard'
import TableAddEditModal from './modals/TableAddEditModal'

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-foreground text-xl font-semibold">Danh sách bàn</h2>
                    <p className="text-muted-foreground text-sm">
                        Quản lý các bàn trong quán của bạn
                    </p>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tables.map((table) => (
                    <TableCard
                        key={table.id}
                        table={table}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}

                {/* Add New Table Card */}
                <AddNewTableCard onClick={() => setShowAddModal(true)} />
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

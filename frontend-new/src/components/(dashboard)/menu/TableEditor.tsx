'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTables } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table as UTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { CirclePlus, List, Trash } from 'lucide-react'

interface FormData {
    name: string
}

const INITIAL_FORM: FormData = { name: '' }

export default function TableEditor() {
    const { state, actions } = useTables()
    const { tables, loading, error } = state
    const { fetchTables, createTable, deleteTable, clearError } = actions

    const [form, setForm] = useState<FormData>(INITIAL_FORM)

    // Memoized values
    const isFormValid = useMemo(() => form.name.trim().length > 0, [form.name])

    const tableCount = useMemo(() => tables.length, [tables.length])

    // Load tables data on component mount
    useEffect(() => {
        if (tables.length === 0) {
            fetchTables()
        }
    }, [fetchTables, tables.length])

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    // Callbacks
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, name: e.target.value }))
    }, [])

    const submit = useCallback(async () => {
        if (!isFormValid) return

        try {
            await createTable({ name: form.name.trim() })
            setForm(INITIAL_FORM)
        } catch (err) {
            console.error('Submit error:', err)
        }
    }, [form, isFormValid, createTable])

    const handleDelete = useCallback(
        async (id: number) => {
            if (window.confirm('Bạn có chắc muốn xoá bàn này?')) {
                await deleteTable(id)
            }
        },
        [deleteTable],
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

    if (loading && tables.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    <span className="text-muted-foreground text-sm">Đang tải danh sách bàn...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-180px)] min-h-[600px] flex-col gap-4 *:p-6 lg:gap-6 xl:flex-row xl:items-stretch">
            {error && (
                <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 max-w-md">
                    <div className="bg-card rounded-lg border p-4 shadow-lg">
                        <div className="flex items-center justify-evenly gap-3">
                            <div className="bg-destructive flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                <span className="text-foreground text-sm font-medium">!</span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-row flex-wrap items-center">
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
                    <CardTitle className="flex items-center justify-start gap-4 text-lg sm:text-xl">
                        <CirclePlus />
                        Thêm bàn mới
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                        Quản lý danh sách bàn trong hệ thống
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Input
                            placeholder="Tên bàn (VD: Bàn 9, VIP 1)"
                            value={form.name}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="text-base sm:text-sm"
                            maxLength={50}
                        />
                        <div className="text-muted-foreground mt-1 text-xs">
                            {form.name.length}/50 ký tự
                        </div>
                    </div>

                    <Button onClick={submit} className="w-full" disabled={loading || !isFormValid}>
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                Đang thêm...
                            </div>
                        ) : (
                            'Thêm bàn'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* List Card */}
            <Card className="flex h-[400px] flex-1 flex-col xl:w-2/3">
                <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <List /> Danh sách bàn
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                    <div className="flex h-fit min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
                        {/* Fixed Header */}
                        <div className="bg-muted/20 flex-shrink-0 border-b">
                            <UTable>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="h-12 font-semibold">
                                            Tên bàn
                                        </TableHead>
                                        <TableHead className="h-12 w-28 text-center font-semibold">
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
                                    {tables.map((table) => (
                                        <TableRow
                                            key={table.id}
                                            className="hover:bg-muted/30 group transition-colors"
                                        >
                                            <TableCell className="py-3 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span>{table.table_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex justify-end px-5 opacity-60 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(table.id)}
                                                        className="h-7 px-2 text-xs"
                                                        disabled={loading}
                                                    >
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </UTable>

                            {tables.length === 0 && (
                                <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
                                    <div className="mb-4 text-6xl">🪑</div>
                                    <div className="mb-2 text-lg font-medium">Chưa có bàn nào</div>
                                    <div className="text-sm">
                                        Thêm bàn đầu tiên để bắt đầu quản lý
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="text-muted-foreground mt-4 flex flex-shrink-0 items-center justify-center gap-4 text-sm">
                        <span className="bg-secondary/20 rounded-full px-3 py-1.5 font-medium">
                            Tổng cộng: {tableCount} bàn
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

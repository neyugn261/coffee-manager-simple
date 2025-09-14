'use client'

import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import Header from '@/components/(dashboard)/Header'
import StatusBadge from '@/components/(dashboard)/order/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTables } from '@/store'
import { getAllStatuses } from '@/lib/statuses'
import type { Status } from '@/lib/types'

export default function EatInIndex() {
    const { state, actions } = useTables()
    const { tables, loading, error } = state
    const { fetchTables } = actions

    // Memoized values for optimization
    const tableCount = useMemo(() => tables.length, [tables.length])

    const statusStats = useMemo(() => {
        const stats = tables.reduce(
            (acc, table) => {
                acc[table.status as Status] = (acc[table.status as Status] || 0) + 1
                return acc
            },
            {} as Record<Status, number>,
        )
        return stats
    }, [tables])

    // Load tables on component mount
    useEffect(() => {
        if (tables.length === 0) {
            fetchTables()
        }
    }, [fetchTables, tables.length])

    if (loading && tables.length === 0) {
        return (
            <div className="flex h-screen flex-col">
                <Header backLink="/order" title="Danh sách bàn" />
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="flex items-center gap-2">
                        <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                        <span className="text-muted-foreground text-sm">
                            Đang tải danh sách bàn...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col">
            <Header backLink="/order" title="Danh sách bàn" />

            {error && (
                <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 max-w-md">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg">
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                                <span className="text-sm font-medium text-red-600">!</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-red-800">Có lỗi xảy ra</p>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                            </div>
                            <button
                                onClick={() => {}}
                                className="flex-shrink-0 text-red-400 transition-colors hover:text-red-600"
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

            {/* Stats Header */}
            <div className="bg-card/50 flex-shrink-0 border-b py-4 select-none">
                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                    <h2 className="text-foreground hidden items-center gap-2 px-6 text-lg font-semibold md:flex">
                        Thống kê bàn
                    </h2>
                    <div className="flex flex-row flex-wrap items-center gap-2 text-xs">
                        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 font-medium">
                            Tổng: {tableCount} bàn
                        </span>
                        {getAllStatuses().map(([status, config]) => (
                            <span
                                key={status}
                                className={`rounded-full px-3 py-1 font-medium ${config.color}`}
                            >
                                {config.label}: {statusStats[status as Status] || 0}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="scrollable-area flex-1 overflow-y-auto">
                <div className="mx-auto max-w-6xl p-8">
                    {tables.length === 0 ? (
                        <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 text-6xl">🪑</div>
                            <div className="mb-2 text-lg font-medium">Chưa có bàn nào</div>
                            <div className="text-sm">
                                Vui lòng thêm bàn trong phần quản lý để bắt đầu
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                            {tables.map((table) => (
                                <Link key={table.id} href={`/order/eat-in/${table.id}`}>
                                    <Card className="group border-border/40 hover:border-primary/20 hover:bg-card/80 cursor-pointer p-1 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <CardHeader className="px-4 pt-4 pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                                    <span className="text-foreground group-hover:text-primary-foreground truncate transition-colors">
                                                        {table.table_name}
                                                    </span>
                                                </CardTitle>
                                                <StatusBadge status={table.status} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-4 pt-0 pb-4">
                                            <div className="text-muted-foreground text-xs font-medium opacity-60 transition-opacity group-hover:opacity-100">
                                                Nhấn để mở order
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

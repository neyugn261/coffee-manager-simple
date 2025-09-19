'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table as TableIcon, CirclePlus, Edit3 } from 'lucide-react'
import { Table } from '@/lib/types'

interface TableAddEditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingTable: Table | null
    tableName: string
    setTableName: (name: string) => void
    onSubmit: (e: React.FormEvent) => void
    onReset: () => void
}

export default function TableAddEditModal({
    open,
    onOpenChange,
    editingTable,
    tableName,
    setTableName,
    onSubmit,
    onReset,
}: TableAddEditModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-popover border-border overflow-hidden rounded-2xl shadow-2xl sm:max-w-md">
                <DialogHeader className="border-border/50 border-b pb-6 select-none">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-xl p-2">
                            {editingTable ? (
                                <Edit3 className="text-primary h-5 w-5" />
                            ) : (
                                <CirclePlus className="text-primary h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-popover-foreground text-xl font-semibold">
                                {editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
                            </DialogTitle>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {editingTable
                                    ? 'Cập nhật thông tin bàn ăn'
                                    : 'Tạo bàn ăn mới cho nhà hàng'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 pt-2">
                    {/* Tên bàn */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 select-none">
                            <TableIcon className="text-muted-foreground h-4 w-4" />
                            <label className="text-popover-foreground text-sm font-medium">
                                Tên bàn
                            </label>
                            <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                                Bắt buộc
                            </Badge>
                        </div>
                        <Input
                            required
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Nhập tên bàn (VD: Bàn 01, Bàn VIP A...)"
                            autoFocus
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 h-11 rounded-xl transition-all duration-200 focus:ring-2"
                        />
                        <p className="text-muted-foreground text-xs">
                            Tên bàn sẽ hiển thị trên hệ thống quản lý và đặt hàng
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-border/50 flex gap-3 border-t pt-6 select-none">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="border-border hover:bg-muted/50 h-11 flex-1 rounded-xl transition-all duration-200"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 h-11 flex-1 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                            {editingTable ? 'Cập nhật bàn' : 'Thêm bàn mới'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

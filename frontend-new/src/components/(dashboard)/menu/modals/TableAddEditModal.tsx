'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface TableAddEditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingTable: any | null
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
            <DialogContent className="bg-popover border-border shadow-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-popover-foreground">
                        {editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
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
                            onClick={onReset}
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
    )
}

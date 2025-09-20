import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface ReLoadButtonProps {
    fn: () => void | Promise<void>
    className?: string
}

export default function ReLoadButton({ fn, className }: ReLoadButtonProps) {
    return (
        <Button
            onClick={fn}
            variant="ghost"
            size="sm"
            className={`bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary border-primary/20 hover:border-primary/30 rounded-xl border whitespace-nowrap transition-all duration-200 ${className}`}
        >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
        </Button>
    )
}

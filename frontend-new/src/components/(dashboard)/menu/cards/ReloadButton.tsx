import { Button } from '@/components/ui/button'

interface ReLoadButtonProps {
    fn: () => void | Promise<void>
    className?: string
}

export default function ReLoadButton({ fn, className }: ReLoadButtonProps) {
    return (
        <Button onClick={fn} variant="secondary" className={`cursor-pointer ${className}`}>
            Làm mới
        </Button>
    )
}

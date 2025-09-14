'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Header({
    title,
    backLink = '/',
    action,
}: {
    title?: string
    backLink?: string
    action?: React.ReactNode
}) {
    return (
        <div className="bg-card supports-backdrop-blur:bg-card/30 sticky top-0 z-10 flex-wrap border-b p-3 backdrop-blur">
            <div className="xs:w-full mx-auto flex items-center justify-start gap-2 md:px-48">
                <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="text-foreground hover:border-accent hover:bg-card/80 bg-card shrink-0 border px-6 py-1 hover:border hover:shadow-md"
                >
                    <Link href={backLink}>Trở về</Link>
                </Button>
                <div className="left-1/2 mx-auto flex-1 px-2 text-center md:absolute">
                    <h1 className="right-1/2 truncate text-sm font-semibold select-none md:relative">
                        {title}
                    </h1>
                </div>
                <div className="min-w-0 shrink-0">{action}</div>
            </div>
        </div>
    )
}

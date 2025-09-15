'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthState {
    isAuthenticated: boolean
    isLoading: boolean
}

export function useAuth(): AuthState {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
    })

    useEffect(() => {
        const checkAuth = () => {
            const apiKey = localStorage.getItem('apiKey')
            const expires = localStorage.getItem('apiKeyExpires')

            if (!apiKey || !expires) {
                setAuthState({ isAuthenticated: false, isLoading: false })
                return
            }

            const expiresDate = new Date(expires)
            const now = new Date()

            console.log('🔍 useAuth: Expiry check - expires:', expiresDate, 'now:', now)

            if (expiresDate > now) {
                setAuthState({ isAuthenticated: true, isLoading: false })
            } else {
                // API key hết hạn, xóa khỏi localStorage
                localStorage.removeItem('apiKey')
                localStorage.removeItem('apiKeyExpires')
                setAuthState({ isAuthenticated: false, isLoading: false })
            }
        }

        checkAuth()
    }, [])

    return authState
}

// Component bọc các trang cần authentication
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500"></div>
                    <p className="text-stone-600">Đang kiểm tra xác thực...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // Sẽ redirect tới login
    }

    return <>{children}</>
}

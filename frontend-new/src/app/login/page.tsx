'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import apiService from '@/services/apiService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage() {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Nếu đã có API key thì auto redirect về home
        const apiKey = localStorage.getItem('apiKey')
        const expires = localStorage.getItem('apiKeyExpires')

        if (apiKey && expires) {
            const expiresDate = new Date(expires)
            const now = new Date()

            // Nếu API key còn hạn thì redirect về home
            if (expiresDate > now) {
                router.replace('/')
                return
            } else {
                // API key hết hạn thì xóa
                localStorage.removeItem('apiKey')
                localStorage.removeItem('apiKeyExpires')
                router.replace('/login')
                return
            }
        }
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!code.trim()) {
            setError('Vui lòng nhập mã code')
            return
        }

        setLoading(true)
        setError('')

        try {
            const data = await apiService.auth.login(code)

            if (data && data.apiKey) {
                localStorage.setItem('apiKey', data.apiKey)
                localStorage.setItem('apiKeyExpires', data.expiresAt)

                console.log('✅ Login thành công, API key đã được lưu')

                // Redirect về home
                router.replace('/')
            } else {
                setError('Đăng nhập thất bại - Mã code không hợp lệ')
            }
        } catch (error) {
            console.error('Login failed:', error)
            if (error instanceof Error) {
                setError(error.message || 'Lỗi kết nối server')
            } else {
                setError('Lỗi kết nối server')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background flex h-full items-center justify-center px-4">
            <Card className="w-full max-w-md p-6">
                <CardHeader className="text-center select-none">
                    <div className="mx-auto mb-4 flex items-center justify-center rounded-full">
                        <Image
                            width={120}
                            height={120}
                            src="/logo.jpg"
                            alt="Logo"
                            className="transform cursor-pointer rounded-3xl shadow-2xl hover:scale-105"
                        />
                    </div>
                    <CardTitle className="text-foreground flex flex-row items-center justify-center gap-3 text-3xl">
                        <FontAwesomeIcon icon={faCoffee} className="h-8 w-8" />
                        Coffee Manager
                    </CardTitle>
                    <CardDescription className="text-secondary">
                        Nhập mã code để đăng nhập
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4 select-none">
                        <label
                            htmlFor="code"
                            className="flex flex-row items-center justify-between text-sm font-bold"
                        >
                            Nhập mã xác thực
                            {error && (
                                <div className="text-center text-sm text-red-500">{error}</div>
                            )}
                        </label>
                        <div>
                            <Input
                                name="code"
                                type="password"
                                placeholder="Nhập mã xác thực"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="text-center text-lg"
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/50 w-full"
                            disabled={loading || !code.trim()}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>

                    <p className="text-secondary mt-6 text-center text-xs select-none">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Vui lòng liên hệ admin để nhận code!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

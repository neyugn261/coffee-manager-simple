'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import apiService from '@/services/apiService'  

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
            // const response = await fetch('http://localhost:5000/api/auth/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ code }),
            // })

            // const data = await response.json()
            const data = await apiService.auth.login(code)            
            if (data) {               
                localStorage.setItem('apiKey', data.apiKey)
                localStorage.setItem('apiKeyExpires', data.expiresAt)

                console.log('✅ Login thành công, API key đã được lưu')

                // Redirect về home
                router.replace('/')
            } else {
                setError(data.message || 'Đăng nhập thất bại')
            }
        } catch (error) {
            console.error('Login failed:', error)
            setError('Lỗi kết nối server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background flex h-full items-center justify-center px-4">
            <Card className="w-full max-w-md p-6">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-500">
                        <Image width={200} height={200} src="/logo.jpg" alt="Logo" />
                    </div>
                    <CardTitle className="text-foreground text-4xl">Coffee Manager</CardTitle>
                    <CardDescription className="text-secondary">
                        Nhập mã code để đăng nhập
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Input
                                type="password"
                                placeholder="Nhập mã code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="text-center font-mono text-lg"
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-purple-500 hover:bg-purple-600"
                            disabled={loading || !code.trim()}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>
                    
                    <p className="mt-6 text-center text-xs text-stone-500">                        
                        Vui lòng liên hệ admin để nhận code!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

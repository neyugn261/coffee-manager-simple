// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

// Get authentication headers
const getAuthHeaders = () => {
    const apiKey = localStorage.getItem('apiKey')
    console.log('Current API Key:', apiKey ? 'Present' : 'Not found')

    // Temporary API key for testing - Remove this in production
    if (!apiKey) {
        console.log('No API key found, requests will fail without authentication')
        return {}
    }

    return {
        Authorization: `Bearer ${apiKey}`,
    }
}

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), // Tự động thêm auth headers
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, config)

        // Nếu 401 (Unauthorized), chuyển về trang login
        if (response.status === 401) {
            localStorage.removeItem('apiKey')
            localStorage.removeItem('apiKeyExpires')
            window.location.href = '/login'
            return
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('API Error Details:', errorData)
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('API Request failed:', error)
        throw error
    }
}

// API methods
export const api = {
    // GET request
    get: (endpoint) => apiRequest(endpoint),

    // POST request
    post: (endpoint, data) =>
        apiRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // PUT request
    put: (endpoint, data) =>
        apiRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    // DELETE request
    delete: (endpoint) =>
        apiRequest(endpoint, {
            method: 'DELETE',
        }),
}

export default api

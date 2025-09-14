import type { Category } from './types'

// Category configuration - centralized management
export const CATEGORIES = {
    drink: {
        label: 'Đồ uống',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    food: {
        label: 'Đồ ăn',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    },
    all: {
        label: 'Tất cả',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    },
} as const

// Helper function to get category info safely
export const getCategoryInfo = (category: Category) => {
    return CATEGORIES[category] || CATEGORIES.all
}

// Get available categories for forms (excluding 'all')
export const getFormCategories = () => {
    return Object.entries(CATEGORIES).filter(([key]) => key !== 'all')
}

// Get categories for statistics (excluding 'all')
export const getStatsCategories = () => {
    return Object.entries(CATEGORIES).filter(([key]) => key !== 'all')
}

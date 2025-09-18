import type { Category } from './types'

// Category configuration - centralized management
export const CATEGORIES = {
    // Drink categories
    coffee: {
        label: 'Cà phê',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    latte: {
        label: 'Latte',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    milkTea: {
        label: 'Trà sữa',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    soda: {
        label: 'Soda',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    fruitTea: {
        label: 'Trà trái cây',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    yaourt: {
        label: 'Yaourt',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    'milo-cacao': {
        label: 'Milo/Cacao',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    juice: {
        label: 'Nước ép',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    bottleDrink: {
        label: 'Nước đóng chai',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    },
    // Food categories
    food: {
        label: 'Đồ ăn',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    },
    topping: {
        label: 'Topping',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    },
    // Other
    other: {
        label: 'Khác',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
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

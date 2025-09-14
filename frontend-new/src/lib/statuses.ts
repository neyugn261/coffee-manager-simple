import type { Status } from './types'

// Status configuration - Map backend ENUM to frontend display
// Backend: 'empty' | 'occupied' → Frontend display labels
export const STATUS_LABELS = {
    empty: {
        label: '� Trống',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    },
    occupied: {
        label: '� Có khách',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    },
} as const

// Helper function to get status info safely
export const getStatusInfo = (status: Status) => {
    return (
        STATUS_LABELS[status] || {
            label: `📄 ${status}`,
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
        }
    )
}

// Get all statuses for forms/selects
export const getAllStatuses = () => {
    return Object.entries(STATUS_LABELS)
}

// Get status stats config for display
export const getStatusStatsConfig = () => {
    return {
        empty: { label: 'Trống', color: STATUS_LABELS.empty.color },
        occupied: { label: 'Có khách', color: STATUS_LABELS.occupied.color },
    }
}

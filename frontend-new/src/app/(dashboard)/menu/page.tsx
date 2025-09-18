'use client'

import { useState } from 'react'
import Header from '@/components/(dashboard)/Header'
import MenuManagement from '@/components/(dashboard)/menu/MenuManagement'
import TableManagement from '@/components/(dashboard)/menu/TableManagement'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChair, faMugHot } from '@fortawesome/free-solid-svg-icons'

export default function MenuPage() {
    const [activeTab, setActiveTab] = useState<'menu' | 'tables'>('menu')

    return (
        <div className="h-full w-full">
            <Header title="Quản lý Menu & Bàn" backLink="/" />
            <div className="bg-background p-8 lg:p-4">
                <div className="mx-auto max-w-7xl">
                    {/* Tab Navigation */}
                    <div className="bg-card/80 border-border mb-6 flex flex-row gap-1 rounded-xl border p-1 shadow-lg backdrop-blur-md *:cursor-pointer">
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex-1 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'menu'
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                            <FontAwesomeIcon icon={faMugHot} /> Quản lý món
                        </button>
                        <button
                            onClick={() => setActiveTab('tables')}
                            className={`flex-1 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'tables'
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                            <FontAwesomeIcon icon={faChair} /> Quản lý bàn
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-card/90 border-border rounded-2xl border p-6 shadow-xl backdrop-blur-lg">
                        {activeTab === 'menu' ? <MenuManagement /> : <TableManagement />}
                    </div>
                </div>
            </div>
        </div>
    )
}

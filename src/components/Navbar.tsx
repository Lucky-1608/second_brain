import Link from 'next/link'
import { LayoutDashboard, CheckSquare, ListTodo, Target, DollarSign, Settings } from 'lucide-react'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', href: '/habits', icon: CheckSquare },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Finances', href: '/finances', icon: DollarSign },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navbar() {
    return (
        <nav className="border-b bg-white dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center">SB</div>
                    <span>Second Brain</span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="hidden md:inline">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}

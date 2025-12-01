import { Navbar } from '@/components/Navbar'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )
}

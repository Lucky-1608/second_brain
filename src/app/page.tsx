import Link from 'next/link'
import { ArrowRight, Brain, CheckCircle2, Layout, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Your Second Brain
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Organize your life, track your habits, manage your finances, and achieve your goals—all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
            <CheckCircle2 className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Habit Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Build better habits with daily tracking, streaks, and progress visualization.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
            <Layout className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Task Management</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage tasks with flexible List and Kanban board views to stay organized.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
            <TrendingUp className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Finance & Goals</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your income, expenses, and long-term goals in a unified dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-500 text-sm border-t dark:border-gray-800">
        <p>© {new Date().getFullYear()} Second Brain. Built with Next.js & Supabase.</p>
      </footer>
    </div>
  )
}

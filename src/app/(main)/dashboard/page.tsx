import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import Link from 'next/link'
import { CheckSquare, ListTodo, DollarSign, Target, ArrowRight } from 'lucide-react'
import { Database } from '@/types/supabase'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const startMonth = startOfMonth(new Date()).toISOString()
    const endMonth = endOfMonth(new Date()).toISOString()

    // Fetch Habits
    const { data: habits } = await supabase.from('habits').select('id')
    const { data: habitLogs } = await supabase.from('habit_logs').select('habit_id').eq('date', todayStr).eq('completed', true)
    const habitsCompleted = habitLogs?.length || 0
    const habitsTotal = habits?.length || 0

    // Fetch Tasks (Today)
    const { data: tasks } = await supabase.from('tasks').select('*').eq('status', 'todo').lte('due_date', new Date().toISOString()).limit(5) as any
    const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'todo').lte('due_date', new Date().toISOString())

    // Fetch Finances
    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, categories(type)')
        .gte('date', startMonth)
        .lte('date', endMonth) as any

    const income = transactions?.filter((t: any) => {
        const cat = t.categories as any
        const type = Array.isArray(cat) ? cat[0]?.type : cat?.type
        return type === 'income'
    }).reduce((sum: number, t: any) => sum + t.amount, 0) || 0

    const expense = transactions?.filter((t: any) => {
        const cat = t.categories as any
        const type = Array.isArray(cat) ? cat[0]?.type : cat?.type
        return type === 'expense'
    }).reduce((sum: number, t: any) => sum + t.amount, 0) || 0

    const balance = income - expense

    // Fetch Goals
    const { data: goals } = await supabase.from('goals').select('*').limit(3) as any

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link href="/habits" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Habits Today</h3>
                        <CheckSquare className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold">{habitsCompleted} / {habitsTotal}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-4">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${habitsTotal > 0 ? (habitsCompleted / habitsTotal) * 100 : 0}%` }} />
                    </div>
                </Link>

                <Link href="/tasks" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tasks Due</h3>
                        <ListTodo className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">{tasksCount || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Next: {tasks?.[0]?.title || 'None'}</p>
                </Link>

                <Link href="/finances" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Balance</h3>
                        <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${balance.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Income: ${income.toFixed(0)} • Exp: ${expense.toFixed(0)}</p>
                </Link>

                <Link href="/goals" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Goals</h3>
                        <Target className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">{goals?.length || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Top: {goals?.[0]?.title || 'None'}</p>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Today&apos;s Tasks</h2>
                        <Link href="/tasks" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tasks?.map((task: any) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="font-medium">{task.title}</span>
                                <span className="ml-auto text-xs text-gray-500 bg-white dark:bg-gray-600 px-2 py-1 rounded">
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                        {(!tasks || tasks.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No tasks due today.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Goal Progress</h2>
                        <Link href="/goals" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {goals?.map((goal: any) => {
                            const progress = goal.target_value ? Math.min(100, Math.max(0, ((goal.current_value || 0) / goal.target_value) * 100)) : 0
                            return (
                                <div key={goal.id}>
                                    <div className="flex items-center justify-between mb-1 text-sm">
                                        <span className="font-medium">{goal.title}</span>
                                        <span className="text-gray-500">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                        {(!goals || goals.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No active goals.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

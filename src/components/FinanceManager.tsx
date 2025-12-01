'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { format, startOfMonth, endOfMonth, addMonths, parseISO } from 'date-fns'
import { Plus, ArrowUp, ArrowDown, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import { Database } from '@/types/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
    categories: Database['public']['Tables']['categories']['Row'] | null
}

interface FinanceManagerProps {
    initialTransactions: Transaction[]
}

export function FinanceManager({ initialTransactions }: FinanceManagerProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [transactions, setTransactions] = useState(initialTransactions)
    const supabase = createClient() as any

    const fetchTransactions = async (date: Date) => {
        const start = startOfMonth(date).toISOString()
        const end = endOfMonth(date).toISOString()

        const { data } = await supabase
            .from('transactions')
            .select('*, categories(*)')
            .gte('date', start)
            .lte('date', end)
            .order('date', { ascending: false })

        if (data) {
            setTransactions(data as Transaction[])
        }
    }

    const changeMonth = (amount: number) => {
        const newDate = addMonths(currentDate, amount)
        setCurrentDate(newDate)
        fetchTransactions(newDate)
    }

    const addTransaction = async () => {
        const amountStr = prompt('Enter amount:')
        if (!amountStr) return
        const amount = parseFloat(amountStr)
        if (isNaN(amount)) return

        const type = confirm('Is this an Income? OK for Income, Cancel for Expense') ? 'income' : 'expense'
        const categoryName = prompt('Enter category name (e.g. Food, Rent):') || 'Uncategorized'

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Find or create category
        let categoryId
        const { data: existingCat } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .eq('type', type)
            .single()

        if (existingCat) {
            categoryId = (existingCat as any).id
        } else {
            const { data: newCat } = await supabase
                .from('categories')
                .insert({ user_id: user.id, name: categoryName, type })
                .select()
                .single()
            if (newCat) categoryId = (newCat as any).id
        }

        if (!categoryId) return

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                category_id: categoryId,
                amount,
                date: format(new Date(), 'yyyy-MM-dd'),
                note: ''
            })
            .select('*, categories(*)')
            .single()

        if (!error && data) {
            // Only add if it belongs to current month
            if (format(new Date(), 'yyyy-MM') === format(currentDate, 'yyyy-MM')) {
                setTransactions([data as Transaction, ...transactions])
            }
        }
    }

    const income = transactions
        .filter(t => t.categories?.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const expense = transactions
        .filter(t => t.categories?.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expense

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold w-32 text-center">{format(currentDate, 'MMM yyyy')}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <button
                    onClick={addTransaction}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-green-600">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <ArrowUp className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Income</span>
                    </div>
                    <p className="text-2xl font-bold">${income.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-red-600">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <ArrowDown className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Expenses</span>
                    </div>
                    <p className="text-2xl font-bold">${expense.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-blue-600">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Net Balance</span>
                    </div>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${balance.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Note</th>
                            <th className="p-4 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4">{format(parseISO(t.date), 'MMM dd')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.categories?.type === 'income'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {t.categories?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{t.note}</td>
                                <td className={`p-4 text-right font-medium ${t.categories?.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {t.categories?.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No transactions for this month.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

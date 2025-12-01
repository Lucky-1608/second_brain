'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Target } from 'lucide-react'
import { Database } from '@/types/supabase'

type Goal = Database['public']['Tables']['goals']['Row']

interface GoalManagerProps {
    goals: Goal[]
}

export function GoalManager({ goals: initialGoals }: GoalManagerProps) {
    const [goals, setGoals] = useState(initialGoals)
    const [term, setTerm] = useState<'Short' | 'Mid' | 'Long'>('Short')
    const supabase = createClient() as any

    const addGoal = async () => {
        const title = window.prompt('Enter goal title:')
        if (!title) return
        const target = window.prompt('Enter target value (number):')
        if (!target) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('goals')
            .insert({
                user_id: user.id,
                title,
                term,
                target_value: parseFloat(target),
                current_value: 0,
                unit: 'units'
            })
            .select()
            .single()

        if (!error && data) {
            setGoals([...goals, data])
        }
    }

    const updateProgress = async (goalId: string, current: number) => {
        const newCurrent = prompt('Enter new current value:', current.toString())
        if (newCurrent === null) return

        const val = parseFloat(newCurrent)
        if (isNaN(val)) return

        const { error } = await supabase
            .from('goals')
            .update({ current_value: val })
            .eq('id', goalId)

        if (!error) {
            setGoals(goals.map(g => g.id === goalId ? { ...g, current_value: val } : g))
        }
    }

    const filteredGoals = goals.filter(g => g.term === term)

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {(['Short', 'Mid', 'Long'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTerm(t)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${term === t ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                }`}
                        >
                            {t} Term
                        </button>
                    ))}
                </div>
                <button
                    onClick={addGoal}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map(goal => {
                    const progress = goal.target_value ? Math.min(100, Math.max(0, ((goal.current_value || 0) / goal.target_value) * 100)) : 0

                    return (
                        <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{goal.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Target: {goal.target_value} {goal.unit}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold">{Math.round(progress)}%</span>
                            </div>

                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Current: {goal.current_value}</span>
                                <button
                                    onClick={() => updateProgress(goal.id, goal.current_value || 0)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    )
                })}
                {filteredGoals.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No {term.toLowerCase()} term goals yet.
                    </div>
                )}
            </div>
        </div>
    )
}

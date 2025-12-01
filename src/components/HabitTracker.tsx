'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { format, subDays } from 'date-fns'
import { Check, Flame, Plus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Database } from '@/types/supabase'

type Habit = Database['public']['Tables']['habits']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']

interface HabitTrackerProps {
    habits: Habit[]
    logs: HabitLog[]
}

export function HabitTracker({ habits: initialHabits, logs: initialLogs }: HabitTrackerProps) {
    const [habits, setHabits] = useState(initialHabits)
    const [logs, setLogs] = useState(initialLogs)
    const supabase = createClient() as any
    const todayStr = format(new Date(), 'yyyy-MM-dd')

    const toggleHabit = async (habitId: string) => {
        const existingLog = logs.find(l => l.habit_id === habitId && l.date === todayStr)

        if (existingLog) {
            // Toggle completion
            const newCompleted = !existingLog.completed
            const { error } = await supabase
                .from('habit_logs')
                .update({ completed: newCompleted })
                .eq('id', existingLog.id)

            if (!error) {
                setLogs(logs.map(l => l.id === existingLog.id ? { ...l, completed: newCompleted } : l))
            }
        } else {
            // Create new log
            const { data, error } = await supabase
                .from('habit_logs')
                .insert({ habit_id: habitId, date: todayStr, completed: true })
                .select()
                .single()

            if (!error && data) {
                setLogs([...logs, data])
            }
        }
    }

    const addHabit = async () => {
        const name = window.prompt('Enter habit name:')
        if (!name) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                name,
                frequency: ['Daily']
            })
            .select()
            .single()

        if (!error && data) {
            setHabits([...habits, data])
        }
    }

    // Calculate stats for chart
    const chartData = Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(new Date(), 29 - i)
        const dateStr = format(date, 'yyyy-MM-dd')
        const dayLogs = logs.filter(l => l.date === dateStr && l.completed)
        const completionRate = habits.length > 0 ? (dayLogs.length / habits.length) * 100 : 0
        return {
            date: format(date, 'MMM dd'),
            completion: Math.round(completionRate),
        }
    })

    // Calculate streaks (simplified: current streak)
    const getStreak = (habitId: string) => {
        let streak = 0
        const habitLogs = logs.filter(l => l.habit_id === habitId && l.completed).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        // Check if completed today
        const completedToday = habitLogs.some(l => l.date === todayStr)
        let currentDate = completedToday ? new Date() : subDays(new Date(), 1)

        while (true) {
            const dateStr = format(currentDate, 'yyyy-MM-dd')
            const hasLog = habitLogs.some(l => l.date === dateStr)
            if (hasLog) {
                streak++
                currentDate = subDays(currentDate, 1)
            } else {
                break
            }
        }
        return streak
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Today</h2>
                        <button
                            onClick={addHabit}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="Add Habit"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {habits.map(habit => {
                            const isCompleted = logs.some(l => l.habit_id === habit.id && l.date === todayStr && l.completed)
                            const streak = getStreak(habit.id)

                            return (
                                <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleHabit(habit.id)}
                                            className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isCompleted
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
                                                }`}
                                        >
                                            {isCompleted && <Check className="w-4 h-4" />}
                                        </button>
                                        <span className={isCompleted ? 'line-through text-gray-400' : ''}>{habit.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                                        <Flame className="w-4 h-4 fill-current" />
                                        <span>{streak}</span>
                                    </div>
                                </div>
                            )
                        })}
                        {habits.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No habits yet. Add one!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 h-[400px]">
                    <h2 className="text-xl font-bold mb-6">Completion History (Last 30 Days)</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                itemStyle={{ color: '#000' }}
                            />
                            <Line type="monotone" dataKey="completion" stroke="#000000" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

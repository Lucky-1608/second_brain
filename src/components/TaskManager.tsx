'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { format, isToday, isThisWeek, isThisMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { Plus, Calendar, List, CheckCircle } from 'lucide-react'
import { Database } from '@/types/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskManagerProps {
    tasks: Task[]
}

export function TaskManager({ tasks: initialTasks }: TaskManagerProps) {
    const [tasks, setTasks] = useState(initialTasks)
    const [view, setView] = useState<'list' | 'board'>('list')
    const supabase = createClient() as any

    const addTask = async () => {
        const title = window.prompt('Enter task title:')
        if (!title) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: user.id,
                title,
                status: 'todo',
                priority: 'Normal',
                due_date: new Date().toISOString()
            })
            .select()
            .single()

        if (!error && data) {
            setTasks([...tasks, data])
        }
    }

    const updateStatus = async (taskId: string, status: 'todo' | 'doing' | 'done') => {
        const { error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)

        if (!error) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t))
        }
    }

    // Grouping for List View
    const todayTasks = tasks.filter(t => t.due_date && isToday(new Date(t.due_date)))
    const weekTasks = tasks.filter(t => t.due_date && isThisWeek(new Date(t.due_date)) && !isToday(new Date(t.due_date)))
    const monthTasks = tasks.filter(t => t.due_date && isThisMonth(new Date(t.due_date)) && !isThisWeek(new Date(t.due_date)))

    // Grouping for Board View (This Week)
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
    const end = endOfWeek(new Date(), { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start, end })

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        <List className="w-4 h-4" />
                        List
                    </button>
                    <button
                        onClick={() => setView('board')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'board' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Board
                    </button>
                </div>
                <button
                    onClick={addTask}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            {view === 'list' ? (
                <div className="space-y-8">
                    <TaskSection title="Today" tasks={todayTasks} onUpdateStatus={updateStatus} />
                    <TaskSection title="This Week" tasks={weekTasks} onUpdateStatus={updateStatus} />
                    <TaskSection title="This Month" tasks={monthTasks} onUpdateStatus={updateStatus} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-4">
                    {weekDays.map(day => {
                        const dateStr = format(day, 'yyyy-MM-dd')
                        const dayTasks = tasks.filter(t => t.due_date && t.due_date.startsWith(dateStr))
                        const isTodayDate = isToday(day)

                        return (
                            <div key={dateStr} className={`min-w-[200px] md:min-w-0 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border ${isTodayDate ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent'}`}>
                                <h3 className={`font-medium mb-3 text-sm ${isTodayDate ? 'text-blue-500' : 'text-gray-500'}`}>
                                    {format(day, 'EEE, MMM d')}
                                </h3>
                                <div className="space-y-3">
                                    {dayTasks.map(task => (
                                        <TaskCard key={task.id} task={task} onUpdateStatus={updateStatus} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function TaskSection({ title, tasks, onUpdateStatus }: { title: string, tasks: Task[], onUpdateStatus: (taskId: string, status: 'todo' | 'doing' | 'done') => Promise<void> }) {
    if (tasks.length === 0) return null
    return (
        <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </h3>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm group">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onUpdateStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-500'
                                    }`}
                            >
                                {task.status === 'done' && <CheckCircle className="w-3.5 h-3.5" />}
                            </button>
                            <span className={task.status === 'done' ? 'line-through text-gray-400' : ''}>{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'Urgent & Important' ? 'bg-red-100 text-red-700' :
                                task.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                {task.priority}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function TaskCard({ task, onUpdateStatus }: { task: Task, onUpdateStatus: (taskId: string, status: 'todo' | 'doing' | 'done') => Promise<void> }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700 text-sm">
            <div className="flex items-start gap-2 mb-2">
                <button
                    onClick={() => onUpdateStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                    className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-500'
                        }`}
                >
                    {task.status === 'done' && <CheckCircle className="w-3 h-3" />}
                </button>
                <span className={`leading-tight ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${task.priority === 'Urgent & Important' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {task.priority}
                </span>
            </div>
        </div>
    )
}

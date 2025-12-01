export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            habits: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    icon: string | null
                    color: string | null
                    frequency: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    icon?: string | null
                    color?: string | null
                    frequency?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    icon?: string | null
                    color?: string | null
                    frequency?: string[] | null
                    created_at?: string
                }
            }
            habit_logs: {
                Row: {
                    id: string
                    habit_id: string
                    date: string
                    completed: boolean
                    note: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    habit_id: string
                    date: string
                    completed?: boolean
                    note?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    habit_id?: string
                    date?: string
                    completed?: boolean
                    note?: string | null
                    created_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    project_id: string | null
                    title: string
                    description: string | null
                    priority: 'Urgent & Important' | 'Urgent' | 'Important' | 'Normal' | null
                    status: 'todo' | 'doing' | 'done' | null
                    due_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    project_id?: string | null
                    title: string
                    description?: string | null
                    priority?: 'Urgent & Important' | 'Urgent' | 'Important' | 'Normal' | null
                    status?: 'todo' | 'doing' | 'done' | null
                    due_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    project_id?: string | null
                    title?: string
                    description?: string | null
                    priority?: 'Urgent & Important' | 'Urgent' | 'Important' | 'Normal' | null
                    status?: 'todo' | 'doing' | 'done' | null
                    due_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    term: 'Short' | 'Mid' | 'Long' | null
                    target_value: number | null
                    current_value: number | null
                    unit: string | null
                    deadline: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    title: string
                    description?: string | null
                    term?: 'Short' | 'Mid' | 'Long' | null
                    target_value?: number | null
                    current_value?: number | null
                    unit?: string | null
                    deadline?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    term?: 'Short' | 'Mid' | 'Long' | null
                    target_value?: number | null
                    current_value?: number | null
                    unit?: string | null
                    deadline?: string | null
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: 'income' | 'expense' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    type?: 'income' | 'expense' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    type?: 'income' | 'expense' | null
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string | null
                    amount: number
                    date: string
                    note: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    category_id?: string | null
                    amount: number
                    date: string
                    note?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category_id?: string | null
                    amount?: number
                    date?: string
                    note?: string | null
                    created_at?: string
                }
            }
        }
    }
}

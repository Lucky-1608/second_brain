import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { TaskManager } from '@/components/TaskManager'

export default async function TasksPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    const { data: tasks } = await supabase.from('tasks').select('*').order('due_date')

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tasks</h1>
            <TaskManager tasks={tasks || []} />
        </div>
    )
}

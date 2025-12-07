import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

import { HabitTracker } from '@/components/HabitTracker'

export default async function HabitsPage() {
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

    const { data: habits } = await supabase.from('habits').select('*').order('created_at')

    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const { data: logs } = await supabase
        .from('habit_logs')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Habits</h1>
            <HabitTracker habits={habits || []} logs={logs || []} />
        </div>
    )
}

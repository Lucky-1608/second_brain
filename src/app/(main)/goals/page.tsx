import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoalManager } from '@/components/GoalManager'

export default async function GoalsPage() {
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

    const { data: goals } = await supabase.from('goals').select('*').order('created_at')

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Goals</h1>
            <GoalManager goals={goals || []} />
        </div>
    )
}

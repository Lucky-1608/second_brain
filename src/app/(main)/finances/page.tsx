import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { FinanceManager } from '@/components/FinanceManager'
import { startOfMonth, endOfMonth } from 'date-fns'

export default async function FinancesPage() {
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

    const today = new Date()
    const start = startOfMonth(today).toISOString()
    const end = endOfMonth(today).toISOString()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*, categories(*)')
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: false })

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Finances</h1>
            <FinanceManager initialTransactions={transactions || []} />
        </div>
    )
}

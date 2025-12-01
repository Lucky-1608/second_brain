import { SignOutButton } from '@/components/SignOutButton'

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4">Account</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your account settings.</p>
                <SignOutButton />
            </div>
        </div>
    )
}
